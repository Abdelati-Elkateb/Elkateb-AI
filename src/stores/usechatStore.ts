import { defineStore } from 'pinia'
import { OpenRouter } from "@openrouter/sdk";



export const useChat = defineStore('chat', {
  state: () => ({
    chats: [] as { role: 'user' | 'assistant'; content: string }[],
  }),

  actions: {
    async addChat(promptText: string) {
      // Add user message
      this.chats.push({
        role: 'user',
        content: promptText,
      });
        
      const client = new OpenRouter({
        apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
        defaultHeaders: {
          "HTTP-Referer": window.location.origin,
          "X-OpenRouter-Title": "Elkateb-AI",
        },
      });

      const completion = await client.chat.send({
        chatRequest: {
          model: "baidu/cobuddy:free",
          messages: [
            {
              role: "user",
              content: promptText,
            },
          ],
        },
      });

      const aiReply = completion.choices[0].message.content;
      
      // Add AI message
      this.chats.push({
        role: 'assistant',
        content: aiReply,
      });
    }
  }
});