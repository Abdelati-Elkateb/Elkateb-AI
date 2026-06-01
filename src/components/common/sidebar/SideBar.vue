<template>
  <aside
    class="sidebar min-h-screen bg-[#f9f9f9] border-r border-black/5 flex flex-col font-sans transition-all duration-300 ease-in-out"
    :class="isCollapsed ? 'w-[60px]' : 'w-[260px]'">

    <div class="p-3 flex items-center" :class="isCollapsed ? 'justify-center' : 'justify-between'">
      <div class="p-2 hover:bg-black/5 rounded-lg cursor-pointer transition-colors shrink-0">
        <img :src="chatGPTIcon" alt="Logo" class="w-6 h-6 opacity-80" />
      </div>

      <div v-if="!isCollapsed" class="p-2 hover:bg-black/5 rounded-lg cursor-pointer text-zinc-500"
        @click="toggleSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 3v18" />
        </svg>
      </div>
    </div>

    <div class="px-3 flex flex-col gap-1 overflow-hidden">
      <button
        @click="startNewChat"
        class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 text-[14px] text-zinc-800 transition-colors whitespace-nowrap w-full">
        <img :src="newChatIcon" alt="new" class="w-4 h-4 opacity-70 shrink-0" />
        <span v-show="!isCollapsed" class="font-medium">New chat</span>
      </button>

      <div
        class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-black/5 text-[14px] text-zinc-800 cursor-pointer group whitespace-nowrap">
        <div class="flex items-center gap-3">
          <img :src="search" alt="search" class="w-4 h-4 opacity-70 shrink-0" />
          <input type="search" class="bg-transparent border-none outline-none text-[13px]" v-show="!isCollapsed" placeholder="Search chats" />
        </div>
        <span v-show="!isCollapsed" class="text-[10px] text-zinc-400 group-hover:text-zinc-500 font-mono">⌘K</span>
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto mt-4 px-3 custom-scrollbar overflow-x-hidden">
      <div v-show="!isCollapsed" class="px-3 py-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
        Today
      </div>

      <ul class="space-y-0.5">
        <li v-for="chat in chatStore.sidebarChats" :key="chat.id" class="group relative">
          <router-link 
            :to="'/' + chat.id"
            @click="chatStore.selectConversation(chat.id)"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] text-zinc-700 hover:bg-black/5 transition-colors whitespace-nowrap"
          >
            <span class="text-zinc-400 text-[14px] shrink-0">💬</span>
            
            <span v-show="!isCollapsed" class="truncate font-normal text-zinc-700 max-w-[150px] block pr-6">
              {{ chat.title }}
            </span>
          </router-link>

          <!-- زر الحذف — دائماً مرئي ولكن باهت، ويصبح واضحاً عند الهوفر -->
          <button 
            v-show="!isCollapsed"
            @click.stop.prevent="handleDelete(chat.id)"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 opacity-40 hover:opacity-100 transition-all duration-200 z-10"
            title="Delete chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>

    <div class="p-3 border-t border-black/5 overflow-hidden">
      <div class="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-black/5 cursor-pointer">
        <div class="w-8 h-8 shrink-0 rounded-full border border-black/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" class="w-5 h-5 opacity-70" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div v-show="!isCollapsed" class="flex flex-col whitespace-nowrap">
          <span class="text-[13px] font-semibold text-zinc-800 leading-tight">Upgrade plan</span>
          <span class="text-[11px] text-zinc-500">More access</span>
        </div>
      </div>
    </div>
  </aside>

  <button v-if="isCollapsed" @click="toggleSidebar" class="fixed top-5 left-14 z-50 p-2 hover:bg-black/5 rounded-lg">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import newChatIcon from '@/assets/img/new-chat.svg'
import chatGPTIcon from '@/assets/img/chat-GPT.svg'
import search from '@/assets/img/search.svg'
import { useSidebar } from '@/composables/useSidebar'
import { useRouter } from 'vue-router';
import { useChatStore } from "@/stores/useChatStore"; // 👈 استدعاء الستور الجديد والمعدل

const router = useRouter();
const chatStore = useChatStore(); // ربط الستور ليعمل داخل التمبليت

const { isCollapsed, toggleSidebar } = useSidebar()

// دالة تفريغ الشاشة والبدء من جديد
const startNewChat = () => {
  chatStore.startNewConversation(); // 🧼 تصفير المحادثة والـ ID
  router.push('/');     // التوجيه للرابط الرئيسي المستعد لاستقبال سؤال جديد
};

// دالة حذف المحادثة
const handleDelete = (id: string) => {
  chatStore.deleteChat(id);
  // التوجيه للرئيسية إذا كانت المحادثة المحذوفة هي المعروضة حالياً
  if (!chatStore.activeConversationId) {
    router.push('/');
  }
};
</script>

<style scoped>
/* لإخفاء شريط التمرير الافتراضي وجعله يبدو مثل ChatGPT */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.15);
}
</style>