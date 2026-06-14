<template>
  <aside
    class="sidebar min-h-screen bg-[#f9f9f9] border-r border-black/5 flex flex-col font-sans transition-all duration-300 ease-in-out fixed md:static left-0 top-0 z-40 md:z-auto h-full"
    :class="[
      isCollapsed ? 'w-[60px]' : 'w-[260px] sm:w-[200px]',
      'md:flex',
      !isSidebarOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0 flex'
    ]">

    <div class="p-2 md:p-3 flex items-center" :class="isCollapsed ? 'justify-center' : 'justify-between'">
      <div class="p-2 hover:bg-black/5 rounded-lg cursor-pointer transition-colors shrink-0">
        <img :src="chatGPTIcon" alt="Logo" class="w-5 md:w-6 h-5 md:h-6 opacity-80" />
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
        class="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-lg hover:bg-black/5 text-xs md:text-[14px] text-zinc-800 transition-colors whitespace-nowrap w-full">
        <img :src="newChatIcon" alt="new" class="w-3 md:w-4 h-3 md:h-4 opacity-70 shrink-0" />
        <span v-show="!isCollapsed" class="font-medium">New chat</span>
      </button>

      <div
        class="flex items-center justify-between px-2 md:px-3 py-2 rounded-lg hover:bg-black/5 text-xs md:text-[14px] text-zinc-800 cursor-pointer group whitespace-nowrap">
        <div class="flex items-center gap-2 md:gap-3 flex-1">
          <img :src="search" alt="search" class="w-3 md:w-4 h-3 md:h-4 opacity-70 shrink-0" />
          <input
            v-if="!isCollapsed"
            v-model="searchQuery"
            type="search"
            class="bg-transparent border-none outline-none text-[11px] md:text-[13px] w-full"
            placeholder="Search chats"
            @keydown.esc="searchQuery = ''"
          />
        </div>
        <span v-show="!isCollapsed" class="text-[8px] md:text-[10px] text-zinc-400 group-hover:text-zinc-500 font-mono">⌘K</span>
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto mt-4 px-2 md:px-3 custom-scrollbar overflow-x-hidden">
      <div v-show="!isCollapsed" class="px-2 md:px-3 py-2 text-[9px] md:text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
        Today
      </div>

      <ul class="space-y-0.5">
        <li
          v-for="chat in filteredChats"
          :key="chat.id"
          class="chat-item"
          @mouseenter="hoveredId = chat.id"
          @mouseleave="hoveredId = null"
        >
          <router-link
            :to="'/' + chat.id"
            @click="chatStore.selectConversation(chat.id)"
            class="chat-link"
          >
            <span class="chat-dot"></span>
            <span v-show="!isCollapsed" class="chat-title">{{ chat.title }}</span>
          </router-link>

          <!-- Delete button — always visible, highlighted on hover -->
          <button
            v-if="!isCollapsed"
            @click.stop.prevent="askDelete(chat.id, chat.title)"
            :class="['delete-btn', hoveredId === chat.id ? 'delete-btn--active' : '']"
            title="Delete chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>

    <div class="p-2 md:p-3 border-t border-black/5 overflow-hidden">
      <div class="flex items-center gap-2 md:gap-3 px-2 py-3 rounded-xl hover:bg-black/5 cursor-pointer">
        <div class="w-6 md:w-8 h-6 md:h-8 shrink-0 rounded-full border border-black/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" class="w-4 md:w-5 h-4 md:h-5 opacity-70" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div v-show="!isCollapsed" class="flex flex-col whitespace-nowrap">
          <span class="text-xs md:text-[13px] font-semibold text-zinc-800 leading-tight">Upgrade plan</span>
          <span class="text-[10px] md:text-[11px] text-zinc-500">More access</span>
        </div>
      </div>
    </div>
  </aside>

  <!-- ── Collapse / Mobile toggle buttons ──────────────────── -->
  <button
    v-if="isCollapsed"
    @click="toggleSidebar"
    class="hidden md:block fixed top-4 left-[76px] z-50 p-2 text-zinc-500 hover:text-zinc-800 hover:bg-black/5 rounded-lg bg-white border border-black/5 shadow-md transition-all"
    title="Expand sidebar"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  </button>

  <button
    v-if="!isSidebarOpen"
    @click="isSidebarOpen = true"
    class="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-black/5 rounded-lg bg-white shadow-md text-zinc-800"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  </button>

  <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/50 z-30 md:hidden"></div>

  <!-- ── Delete Confirmation Modal ─────────────────────────── -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="confirmModal.show"
        class="fixed inset-0 z-[999] flex items-center justify-center px-4"
        @click.self="cancelDelete"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        <!-- Card -->
        <div class="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-5 border border-zinc-100 dark:border-zinc-800">

          <!-- Icon -->
          <div class="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-500 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>

          <!-- Text -->
          <div class="text-center">
            <h2 class="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Delete this chat?</h2>
            <p class="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[240px] mx-auto">
              "<span class="font-medium text-zinc-700 dark:text-zinc-300">{{ confirmModal.title }}</span>" will be permanently removed.
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 w-full">
            <button
              @click="cancelDelete"
              class="flex-1 py-2.5 rounded-2xl text-[13px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-150 active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              class="flex-1 py-2.5 rounded-2xl text-[13px] font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-150 active:scale-95 shadow-md shadow-red-500/20 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import newChatIcon from '@/assets/img/new-chat.svg'
import chatGPTIcon from '@/assets/img/chat-GPT.svg'
import search from '@/assets/img/search.svg'
import { useSidebar } from '@/composables/useSidebar'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/useChatStore'

const router = useRouter()
const chatStore = useChatStore()

const { isCollapsed, toggleSidebar } = useSidebar()
const isSidebarOpen = ref(true)
const searchQuery = ref('')
const hoveredId = ref<string | null>(null)

// ── Delete confirmation state ────────────────────────────
const confirmModal = reactive({
  show: false,
  id: '' as string,
  title: '' as string,
})

const askDelete = (id: string, title: string) => {
  confirmModal.id = id
  confirmModal.title = title
  confirmModal.show = true
}

const cancelDelete = () => {
  confirmModal.show = false
  confirmModal.id = ''
  confirmModal.title = ''
}

const confirmDelete = () => {
  chatStore.deleteChat(confirmModal.id)
  if (!chatStore.activeConversationId) {
    router.push('/')
  }
  cancelDelete()
}

// ── Search ───────────────────────────────────────────────
const filteredChats = computed(() => {
  if (!searchQuery.value) return chatStore.sidebarChats
  return chatStore.sidebarChats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// ── New chat ─────────────────────────────────────────────
const startNewChat = () => {
  chatStore.startNewConversation()
  router.push('/')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,.08); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,.15); }

/* Chat list item */
.chat-item {
  position: relative;
  display: flex;
  align-items: center;
}

.chat-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 12px;
  font-size: 13px;
  color: #3f3f46;
  text-decoration: none;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  transition: background 0.15s;
  padding-right: 36px;
}
.chat-link:hover { background: rgba(0,0,0,0.05); }

.chat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d4d4d8;
  flex-shrink: 0;
  transition: background 0.15s;
}
.chat-item:hover .chat-dot { background: #a1a1aa; }

.chat-title {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
  line-height: 1.3;
  font-weight: 400;
}

/* Delete button — always shown, gets red on row hover */
.delete-btn {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #d4d4d8;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  z-index: 10;
  flex-shrink: 0;
}
.delete-btn svg { width: 14px; height: 14px; }

.delete-btn--active {
  color: #ef4444;
  background: #fef2f2;
}
.delete-btn:hover {
  color: #ef4444 !important;
  background: #fef2f2 !important;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}
.modal-enter-from .relative {
  transform: scale(0.92) translateY(12px);
  opacity: 0;
}
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>