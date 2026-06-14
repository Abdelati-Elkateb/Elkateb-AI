import { defineStore } from 'pinia'
import { OpenRouter } from "@openrouter/sdk";
import { toRaw } from 'vue';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
}

interface SidebarItem {
  id: string;
  title: string;
}

interface ConversationsMap {
  [conversationId: string]: ChatMessage[];
}

function migrateOldData(): ConversationsMap {
  const conversations: ConversationsMap = JSON.parse(localStorage.getItem('my_conversations') || '{}');

  if (Object.keys(conversations).length > 0) {
    return conversations;
  }

  const oldChats: ChatMessage[] = JSON.parse(localStorage.getItem('my_entire_chat') || '[]');
  const sidebarChats: SidebarItem[] = JSON.parse(localStorage.getItem('my_sidebar_chats') || '[]');

  if (oldChats.length === 0 || sidebarChats.length === 0) {
    return conversations;
  }


  for (const sidebarItem of sidebarChats) {
    const matchingMessages: ChatMessage[] = [];
    let found = false;

    for (let i = 0; i < oldChats.length; i++) {
      const msg = oldChats[i];

      if (msg.role === 'user' && i + 1 < oldChats.length && oldChats[i + 1].id === sidebarItem.id) {
        matchingMessages.push(msg);
        matchingMessages.push(oldChats[i + 1]);
        found = true;
      }
    }

    if (found) {
      conversations[sidebarItem.id] = matchingMessages;
    } else {
      conversations[sidebarItem.id] = [...oldChats];
    }
  }

  localStorage.setItem('my_conversations', JSON.stringify(conversations));
  console.log('✅ تم ترحيل البيانات القديمة بنجاح');

  return conversations;
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [] as ChatMessage[],

    sidebarChats: JSON.parse(localStorage.getItem('my_sidebar_chats') || '[]') as SidebarItem[],

    conversations: migrateOldData() as ConversationsMap,

    activeConversationId: null as string | null,

    isThinking: false
  }),

  getters: {
    activeMessages(state): ChatMessage[] {
      if (state.activeConversationId && state.conversations[state.activeConversationId]) {
        return state.conversations[state.activeConversationId];
      }
      return state.chats;
    }
  },

  actions: {
    async addChat(promptText: string) {
      const cleanText = promptText.trim();
      if (!cleanText) return;

      this.chats.push({
        role: 'user',
        content: cleanText,
        id: 'temp-' + Date.now().toString()
      });

      this.isThinking = true;

      const client = new OpenRouter({
        apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
        defaultHeaders: {
          "HTTP-Referer": window.location.origin,
          "X-OpenRouter-Title": "Elkateb-AI",
        },
      });






      try {
        const cleanMessages = toRaw(this.chats).map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        const completion = await client.chat.send({
          chatRequest: {
            model: "openai/gpt-oss-120b:free",
            messages: cleanMessages,
          },
        });

        const aiReply = completion?.choices?.[0]?.message?.content;
        const aiReplyId = completion?.id; // التقاط الـ ID الرسمي الفريد من السيرفر

        if (aiReply && aiReplyId) {
          const chatTitle = cleanText.length > 25 ? cleanText.slice(0, 25) + '...' : cleanText;

          this.chats.push({
            role: 'assistant',
            content: aiReply,
            id: aiReplyId
          });

          const convId = this.activeConversationId || aiReplyId;
          this.activeConversationId = convId;

          this.conversations[convId] = [...this.chats];
          localStorage.setItem("my_conversations", JSON.stringify(this.conversations));

          const exists = this.sidebarChats.some(item => item.id === convId);

          if (!exists) {
            this.sidebarChats.push({
              id: convId,
              title: chatTitle
            });

            localStorage.setItem("my_sidebar_chats", JSON.stringify(this.sidebarChats));
          }

          console.log("✅ تم حفظ المحادثة:", convId);
          console.log("📦 conversations keys:", Object.keys(this.conversations));

          return convId;

        } else {
          console.error("الرد عاد فارغاً من السيرفر.");
        }

      } catch (error) {
        console.error("حدث خطأ أثناء الاتصال بالـ API:", error);
      } finally {
        this.isThinking = false;
      }
    },

    // دالة السايدبار عند الضغط على محادثة معينة — تحميل رسائلها من الـ localStorage
    selectConversation(conversationId: string) {
      console.log("🔍 selectConversation called with:", conversationId);

      this.activeConversationId = conversationId;

      if (this.conversations[conversationId] && this.conversations[conversationId].length > 0) {
        this.chats = [...this.conversations[conversationId]];
        console.log("✅ loaded from memory:", this.chats.length, "messages");
        return;
      }

      // ثانياً: نقرأ من localStorage مباشرة
      const stored: ConversationsMap = JSON.parse(localStorage.getItem('my_conversations') || '{}');
      if (stored[conversationId] && stored[conversationId].length > 0) {
        this.conversations = stored;
        this.chats = [...stored[conversationId]];
        console.log("✅ loaded from localStorage:", this.chats.length, "messages");
        return;
      }

      const oldChats: ChatMessage[] = JSON.parse(localStorage.getItem('my_entire_chat') || '[]');
      if (oldChats.length > 0) {
        const relatedMessages: ChatMessage[] = [];
        for (let i = 0; i < oldChats.length; i++) {
          const msg = oldChats[i];
          if (msg.id === conversationId ||
            (msg.role === 'user' && i + 1 < oldChats.length && oldChats[i + 1].id === conversationId)) {
            if (msg.role === 'user') {
              relatedMessages.push(msg);
              if (i + 1 < oldChats.length) relatedMessages.push(oldChats[i + 1]);
            } else {
              if (i > 0 && oldChats[i - 1].role === 'user') {
                relatedMessages.push(oldChats[i - 1]);
              }
              relatedMessages.push(msg);
            }
            break;
          }
        }

        if (relatedMessages.length > 0) {
          this.chats = relatedMessages;
          this.conversations[conversationId] = [...relatedMessages];
          localStorage.setItem("my_conversations", JSON.stringify(this.conversations));
          console.log("✅ migrated from old data:", this.chats.length, "messages");
          return;
        }
      }

      console.log("⚠️ No messages found for:", conversationId);
      this.chats = [];
    },

    startNewConversation() {
      this.activeConversationId = null;
      this.chats = [];
    },

    deleteChat(conversationId: string) {
      this.sidebarChats = this.sidebarChats.filter(item => item.id !== conversationId);
      localStorage.setItem("my_sidebar_chats", JSON.stringify(this.sidebarChats));

      delete this.conversations[conversationId];
      localStorage.setItem("my_conversations", JSON.stringify(this.conversations));

      let oldChats: ChatMessage[] = JSON.parse(localStorage.getItem('my_entire_chat') || '[]');
      if (oldChats.length > 0) {
        const newOldChats = [];
        let skipNext = false;
        for (let i = 0; i < oldChats.length; i++) {
          const msg = oldChats[i];
          if (msg.id === conversationId ||
            (msg.role === 'user' && i + 1 < oldChats.length && oldChats[i + 1].id === conversationId)) {
            if (msg.role === 'user') skipNext = true;
            continue;
          }
          if (skipNext) {
            skipNext = false;
            continue;
          }
          newOldChats.push(msg);
        }
        localStorage.setItem('my_entire_chat', JSON.stringify(newOldChats));
      }

      if (this.activeConversationId === conversationId) {
        this.activeConversationId = null;
        this.chats = [];
      }

      console.log("🗑️ تم حذف المحادثة:", conversationId);
    }
  }




});