import { defineStore } from 'pinia'
import { OpenRouter } from "@openrouter/sdk";
import { toRaw } from 'vue';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
}

// تعريف شكل الكرت للسايدبار
interface SidebarItem {
  id: string;
  title: string;
}

// نوع لتخزين رسائل كل محادثة على حدة
interface ConversationsMap {
  [conversationId: string]: ChatMessage[];
}

// دالة الهجرة: تحويل البيانات القديمة (my_entire_chat) إلى الشكل الجديد (my_conversations)
function migrateOldData(): ConversationsMap {
  const conversations: ConversationsMap = JSON.parse(localStorage.getItem('my_conversations') || '{}');
  
  // لو فيه بيانات جديدة بالفعل، لا حاجة للهجرة
  if (Object.keys(conversations).length > 0) {
    return conversations;
  }

  // قراءة البيانات القديمة
  const oldChats: ChatMessage[] = JSON.parse(localStorage.getItem('my_entire_chat') || '[]');
  const sidebarChats: SidebarItem[] = JSON.parse(localStorage.getItem('my_sidebar_chats') || '[]');

  if (oldChats.length === 0 || sidebarChats.length === 0) {
    return conversations;
  }

  // تجميع الرسائل حسب الـ ID — كل sidebar item يمثل محادثة
  // نعيد بناء المحادثات من الرسائل القديمة
  // الطريقة: لكل sidebar item، نبحث عن رسالة assistant بنفس الـ ID
  // ونأخذ كل الرسائل قبلها وبعدها حتى الرسالة التالية بـ ID مختلف
  for (const sidebarItem of sidebarChats) {
    // نبحث عن أي رسالة assistant تحمل نفس الـ ID
    const matchingMessages: ChatMessage[] = [];
    let found = false;

    for (let i = 0; i < oldChats.length; i++) {
      const msg = oldChats[i];
      
      // إذا وجدنا رسالة user قبل الرد المطابق
      if (msg.role === 'user' && i + 1 < oldChats.length && oldChats[i + 1].id === sidebarItem.id) {
        matchingMessages.push(msg);
        matchingMessages.push(oldChats[i + 1]);
        found = true;
      }
    }

    // لو ما لقينا بالطريقة أعلاه، نحط كل الرسائل تحت أول محادثة
    if (found) {
      conversations[sidebarItem.id] = matchingMessages;
    } else {
      // فولباك: نحط كل الرسائل القديمة تحت هذا الـ ID
      conversations[sidebarItem.id] = [...oldChats];
    }
  }

  // حفظ البيانات المهاجرة
  localStorage.setItem('my_conversations', JSON.stringify(conversations));
  console.log('✅ تم ترحيل البيانات القديمة بنجاح');

  return conversations;
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    // الرسائل المعروضة حالياً على الشاشة
    chats: [] as ChatMessage[],
    
    // قائمة السايدبار
    sidebarChats: JSON.parse(localStorage.getItem('my_sidebar_chats') || '[]') as SidebarItem[],
    
    // خريطة تخزين رسائل كل محادثة بـ ID الخاص بها
    conversations: migrateOldData() as ConversationsMap,
    
    // معرّف المحادثة النشطة حالياً
    activeConversationId: null as string | null,
    
    isThinking: false
  }),

  getters: {
    // جلب رسائل المحادثة النشطة
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

      // إضافة سؤال المستخدم إلى المصفوفة مع ID مؤقت
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
          // توليد العنوان الأنيق عبر قص أول 25 حرفاً من سؤال المستخدم
          const chatTitle = cleanText.length > 25 ? cleanText.slice(0, 25) + '...' : cleanText;

          // إضافة رد البوت إلى المصفوفة الرئيسية
          this.chats.push({
            role: 'assistant',
            content: aiReply,
            id: aiReplyId
          });

          // تحديد ID المحادثة — إذا مافيش محادثة نشطة، استخدم aiReplyId كمعرّف جديد
          const convId = this.activeConversationId || aiReplyId;
          this.activeConversationId = convId;

          // 💾 حفظ رسائل هذه المحادثة في الخريطة
          this.conversations[convId] = [...this.chats];
          localStorage.setItem("my_conversations", JSON.stringify(this.conversations));

          // 💾 الحفظ الذكي في مصفوفة السايدبار (بدون تكرار)
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
          
          // إرجاع ID المحادثة لاستخدامه في التوجيه
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
      
      // أولاً: نحاول من الذاكرة
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

      // ثالثاً: فولباك للبيانات القديمة — نبحث في my_entire_chat
      const oldChats: ChatMessage[] = JSON.parse(localStorage.getItem('my_entire_chat') || '[]');
      if (oldChats.length > 0) {
        // نبحث عن الرسائل المرتبطة بهذا الـ ID
        const relatedMessages: ChatMessage[] = [];
        for (let i = 0; i < oldChats.length; i++) {
          const msg = oldChats[i];
          // نأخذ رسالة user + assistant المرتبطة بالـ ID
          if (msg.id === conversationId || 
              (msg.role === 'user' && i + 1 < oldChats.length && oldChats[i + 1].id === conversationId)) {
            if (msg.role === 'user') {
              relatedMessages.push(msg);
              if (i + 1 < oldChats.length) relatedMessages.push(oldChats[i + 1]);
            } else {
              // لو الرسالة نفسها هي الـ assistant
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
          // نحفظ في الشكل الجديد
          this.conversations[conversationId] = [...relatedMessages];
          localStorage.setItem("my_conversations", JSON.stringify(this.conversations));
          console.log("✅ migrated from old data:", this.chats.length, "messages");
          return;
        }
      }

      console.log("⚠️ No messages found for:", conversationId);
      this.chats = [];
    },

    // بدء محادثة جديدة — تصفير كل شيء
    startNewConversation() {
      this.activeConversationId = null;
      this.chats = [];
    },

    // حذف محادثة من السايدبار والـ localStorage
    deleteChat(conversationId: string) {
      // 1️⃣ حذف من السايدبار
      this.sidebarChats = this.sidebarChats.filter(item => item.id !== conversationId);
      localStorage.setItem("my_sidebar_chats", JSON.stringify(this.sidebarChats));

      // 2️⃣ حذف من خريطة المحادثات
      delete this.conversations[conversationId];
      localStorage.setItem("my_conversations", JSON.stringify(this.conversations));

      // 3️⃣ إزالة من النسخة القديمة (my_entire_chat) إن وجدت حتى لا تعود بالخطأ
      let oldChats: ChatMessage[] = JSON.parse(localStorage.getItem('my_entire_chat') || '[]');
      if (oldChats.length > 0) {
        // فلترة الرسائل الخاصة بهذا الـ ID
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

      // 4️⃣ لو المحادثة المحذوفة هي النشطة حالياً — نصفّر الشاشة
      if (this.activeConversationId === conversationId) {
        this.activeConversationId = null;
        this.chats = [];
      }

      console.log("🗑️ تم حذف المحادثة:", conversationId);
    }
  }
});