<template>
    <div class="flex flex-col h-screen p-4 items-center transition-all duration-500 ease-in-out bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50"
        :class="isChatStarted ? 'justify-between pb-6' : 'justify-center'">

        <!-- 1. ChatGPT Welcome Text -->
        <div v-if="!isChatStarted" class="text-center mb-6 animate-fade-in">
            <h1 class="text-3xl font-medium tracking-tight mb-2">How can I help you today?</h1>
        </div>

        <!-- 2. ChatGPT Chat Content Area -->
        <div v-if="isChatStarted" class="flex-1 w-full overflow-y-auto mb-4 px-2 scrollbar-none animate-fade-in">
            <div class="flex flex-col space-y-4 max-w-3xl mx-auto w-full py-4">
                
                <!-- Messages from Store -->
                <div v-for="(message, index) in chatStore.chats" :key="index" 
                    class="flex animate-fade-in"
                    :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
                    
                    <!-- User Message (Right side) -->
                    <div v-if="message.role === 'user'"
                        class="max-w-xs px-4 py-2 rounded-lg bg-blue-600 text-white rounded-br-none">
                        {{ message.content }}
                    </div>
                    
                    <!-- AI Message (Left side) -->
                    <div v-else
                        class="max-w-xs px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 rounded-bl-none">
                        {{ message.content }}
                    </div>
                </div>

                <!-- 🧠 Beautiful Minimalist Thinking Indicator -->
                <div v-if="isThinking" class="flex flex-col space-y-1.5 pt-4 animate-fade-in">
                    <div class="flex items-center space-x-2 text-zinc-400 dark:text-zinc-500">
                        <!-- Thinking Sparkle/Brain Icon -->
                        <svg class="w-4 h-4 animate-spin-slow" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9.813 15.904 9 21l-.813-5.096L3 15l5.187-.813L9 9l.813 5.187L15 15l-5.187.813ZM18.25 5.25 17.5 8.5l-.75-3.25L13.5 4.5l3.25-.75.75-3.25.75 3.25 3.25.75-3.25.75Z" />
                        </svg>
                        <span class="text-xs font-medium tracking-wide">Elkateb AI is thinking...</span>
                    </div>

                    <!-- Three smooth bouncing typing dots -->
                    <div class="flex items-center space-x-1 pl-6 h-6">
                        <div class="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce-dot">
                        </div>
                        <div
                            class="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce-dot [animation-delay:0.2s]">
                        </div>
                        <div
                            class="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce-dot [animation-delay:0.4s]">
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- 3. Your BaseButton (Completely Untouched Width/Padding) -->
        <BaseButton @isChatStarted="simulateSearch" />

    </div>
</template>

<script setup>
import BaseButton from '@/components/common/baseButton.vue'
import { ref } from 'vue'
import { useChat } from "@/stores/usechatStore";

const chatStore = useChat();


const isChatStarted = ref(false)
const isThinking = ref(false)

// Simulation function to show how it toggles
const simulateSearch = () => {
    isChatStarted.value = true
    isThinking.value = true // 👈 Turn on thinking indicator when query goes out

    // Fake API resolution after 3 seconds
    setTimeout(() => {
        isThinking.value = false // 👈 Turn it off when response arrives
    }, 3000)
}
</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(4px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounceDot {

    0%,
    100% {
        transform: translateY(0);
        opacity: 0.4;
    }

    50% {
        transform: translateY(-4px);
        opacity: 1;
    }
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}

.animate-bounce-dot {
    animation: bounceDot 1.4s infinite ease-in-out;
}

.animate-spin-slow {
    animation: spin 4s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.scrollbar-none::-webkit-scrollbar {
    display: none;
}

.scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
