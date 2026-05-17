<template>
  <div
    class="bg-[#ffffff] flex flex-col border border-gray-100 w-[70%] shadow-lg py-4 overflow-hidden !rounded-4xl px-4 focus-within:ring-2 focus-within:ring-gray-100 h-auto">

    <!-- Image Preview -->
    <div v-if="imageUrl" class="mb-3 flex items-start">
      <div class="relative group">
        <img :src="imageUrl" alt="Preview" class="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm" />
        <button @click="removeImage"
          class="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5 shadow-md hover:bg-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path
              d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Text Input -->
    <input type="text" placeholder="Ask anything" class="w-full focus:outline-none mb-4" />

    <!-- Bottom Action Bar -->
    <div class="flex gap-3 items-center">
      <div class="flex items-center gap-2">
        <div class="relative group">
          <label for="chatgpt-file-upload"
            class="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-200 text-gray-500 hover:bg-gray-200 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
              stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </label>
          <input id="chatgpt-file-upload" type="file" class="hidden" ref="fileInput" accept="image/*"
            @change="handleFileChange" />
        </div>

        <span v-if="selectedFileName && !imageUrl" class="text-xs text-gray-500 truncate max-w-[150px]">
          {{ selectedFileName }}
        </span>
      </div>

      <div class="ml-auto flex gap-2 items-center">
        <VoicePrompt ref="voicePromptRef" />

        <div @click="openVoiceModal"
          class="h-[40px] w-[40px] bg-[#333] rounded-full flex items-center justify-center cursor-pointer hover:bg-black transition-colors">
          <img :src="recorder" alt="recorder" class="w-[18px] h-[18px]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import recorder from '@/assets/img/Vector.svg'
import VoicePrompt from '@/components/common/VoicePrompt.vue'

const voicePromptRef = ref<InstanceType<typeof VoicePrompt> | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFileName = ref('')
const imageUrl = ref<string | null>(null)

const openVoiceModal = () => {
  voicePromptRef.value?.startListening()
}

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    selectedFileName.value = file.name
    imageUrl.value = file.type.startsWith('image/') ? URL.createObjectURL(file) : null
  }
}

const removeImage = () => {
  imageUrl.value = null
  selectedFileName.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>