<template>
  <div>

    <button
      @click="startListening"
      class="w-10 h-10 flex items-center justify-center rounded-full text-gray-900 hover:bg-gray-100 transition"
      :class="{ 'text-red-500 animate-pulse': isListening }"
    >
      <MicrophoneIcon :class="iconClass" />
    </button>

    <Teleport>
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-zinc-900 w-full max-w-sm p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">
          
          <h3 class="text-zinc-500 dark:text-zinc-400 font-medium mb-8">
            {{ isListening ? 'جاري الاستماع...' : 'انتهى الاستماع' }}
          </h3>

          <!-- شكل الموجة الصوتي (بسيط) -->
          <div class="flex items-center justify-center space-x-1 h-12 mb-8">
            <div v-for="i in 5" :key="i" 
                 class="w-1 bg-black dark:bg-white rounded-full transition-all duration-150"
                 :style="{ height: isListening ? `${Math.random() * 100}%` : '20%' }"
                 :class="{ 'animate-bounce': isListening }">
            </div>
          </div>

          <!-- النص المكتوب حالياً -->
          <p class="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-8 min-h-[1.5em]">
            {{ result || 'قل شيئاً...' }}
          </p>

          <!-- أزرار التحكم -->
          <div class="flex space-x-4">
            <button @click="stopListening" class="px-6 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-full font-medium">
              إلغاء
            </button>
            <button @click="confirmText" class="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium">
              تم
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MicrophoneIcon } from "@heroicons/vue/24/solid";
import { useSpeechRecognition } from '@vueuse/core';

interface Props {
  iconClass?: string;
}

const props = defineProps<Props>();

</script>

<style scoped>
/* إضافة تأثيرات بسيطة للموجات */
.animate-bounce {
  animation: bounce 0.6s infinite alternate;
}
@keyframes bounce {
  from { transform: scaleY(0.5); }
  to { transform: scaleY(1.5); }
}
</style>