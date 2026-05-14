<script setup lang="ts">
import { useVoicePrompt } from "@/components/composables/VoicePrompt/useVoicePrompt";

const {
  showModal,
  isListening,
  result,
  startListening, // الدالة التي تفتح المودال وتبدأ التسجيل
  stopListening,
  confirmText,
} = useVoicePrompt();

// نفتح هذه الدالة للأب لكي يتمكن من استدعائها
defineExpose({
  startListening
});
</script>

<template>
  <Teleport to="body">
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <!-- ... باقي الكود كما هو ... -->
      <div
        class="bg-white dark:bg-zinc-900 w-full max-w-sm p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">
        <h3 class="text-zinc-500 dark:text-zinc-400 font-medium mb-8">
          {{ isListening ? "جاري الاستماع..." : "انتهى الاستماع" }}
        </h3>

        <div class="flex items-center justify-center space-x-1 h-12 mb-8">
          <div v-for="i in 5" :key="i" class="w-1 bg-black dark:bg-white rounded-full transition-all duration-150"
            :style="{ height: isListening ? `${Math.random() * 100}%` : '20%' }"
            :class="{ 'animate-bounce': isListening }"></div>
        </div>

        <p class="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-8 min-h-[1.5em]">
          {{ result || "قل شيئاً..." }}
        </p>

        <div class="flex space-x-4">
          <button @click="stopListening"
            class="px-6 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-full font-medium">إلغاء</button>
          <button @click="confirmText"
            class="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium">تم</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>