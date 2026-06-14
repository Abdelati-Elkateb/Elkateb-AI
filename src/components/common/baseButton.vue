<template>
  <form
    @submit.prevent="sendMessage"
    class="bg-white flex flex-col border border-gray-100 w-full md:w-[65%] shadow-lg py-3 md:py-4 overflow-hidden rounded-3xl px-3 md:px-5 focus-within:ring-2 focus-within:ring-gray-100 h-auto mx-auto"
  >
    <!-- Image preview -->
    <div v-if="imageUrl" class="mb-3 flex items-start">
      <div class="relative">
        <img
          :src="imageUrl"
          alt="Preview"
          class="w-14 h-14 object-cover rounded-xl border border-gray-200 shadow-sm"
        />
        <button
          type="button"
          @click="removeImage"
          class="absolute -top-2 -right-2 bg-black text-white rounded-full p-0.5 shadow hover:bg-gray-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- File name badge (non-image) -->
    <div v-if="selectedFileName && !imageUrl" class="mb-3 flex items-center gap-2 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-xl w-fit max-w-[220px]">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4 text-gray-500 shrink-0">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
      <span class="text-xs text-gray-600 truncate">{{ selectedFileName }}</span>
      <button type="button" @click="removeImage" class="text-gray-400 hover:text-gray-600 ml-auto shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </div>

    <!-- Input -->
    <input
      v-model="userInput"
      type="text"
      placeholder="Write your prompt here"
      class="w-full focus:outline-none mb-3 md:mb-4 text-sm md:text-[15px] text-gray-800 placeholder-gray-400 bg-transparent"
      :disabled="isLoading"
    />

    <!-- Toolbar -->
    <div class="flex items-center gap-2 md:gap-3">
      <!-- Attach -->
      <div class="relative">
        <label
          for="chatgpt-file-upload"
          class="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          title="Attach file"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </label>
        <input
          id="chatgpt-file-upload"
          type="file"
          class="hidden"
          ref="fileInput"
          accept="image/*,.txt,.js,.ts,.html,.css,.json,.md,.csv,.xml,.pdf"
          @change="handleFileChange"
        />
      </div>

      <!-- Voice Prompt (hidden modal, triggered below) -->
      <VoicePrompt ref="voicePromptRef" @confirm="handleVoiceConfirm" />

      <!-- Mic button -->
      <div
        @click="openVoiceModal"
        class="h-9 w-9 bg-[#333] rounded-full flex items-center justify-center cursor-pointer hover:bg-black transition-colors ml-auto"
        title="Voice input"
      >
        <img :src="recorder" alt="recorder" class="w-[17px] h-[17px]" />
      </div>

      <!-- Send button -->
      <button
        type="submit"
        :disabled="isLoading || (!userInput.trim() && !selectedFileName)"
        class="h-9 w-9 bg-[#333] rounded-full flex items-center justify-center cursor-pointer hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        title="Send"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
        </svg>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import recorder from "@/assets/img/Vector.svg";
import VoicePrompt from "@/components/common/VoicePrompt.vue";
import { useChatStore } from "@/stores/useChatStore";
import { useRouter } from "vue-router";

const chatStore = useChatStore();
const router = useRouter();

const voicePromptRef = ref<InstanceType<typeof VoicePrompt> | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const selectedFileName = ref("");
const imageUrl = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const userInput = ref("");
const isLoading = ref(false);
const isChatStarted = ref(false);

// ── Voice ────────────────────────────────────────────────
const openVoiceModal = () => voicePromptRef.value?.startListening();

const handleVoiceConfirm = (text: string) => {
  if (!text) return;
  userInput.value = userInput.value.trim()
    ? userInput.value + " " + text.trim()
    : text.trim();
};

// ── File ─────────────────────────────────────────────────
const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  selectedFile.value = file;
  selectedFileName.value = file.name;
  imageUrl.value = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
};

const removeImage = () => {
  imageUrl.value = null;
  selectedFileName.value = "";
  selectedFile.value = null;
  if (fileInput.value) fileInput.value.value = "";
};

// ── File readers ──────────────────────────────────────────
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.readAsDataURL(file);
    r.onload = () => res(r.result as string);
    r.onerror = rej;
  });

const fileToText = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.readAsText(file);
    r.onload = () => res(r.result as string);
    r.onerror = rej;
  });

// ── Send ──────────────────────────────────────────────────
const sendMessage = async () => {
  const promptText = userInput.value.trim();
  const file = selectedFile.value;
  if ((!promptText && !file) || isLoading.value) return;

  isLoading.value = true;
  isChatStarted.value = true;
  emit("isChatStarted", true);

  userInput.value = "";

  try {
    let fileAttachment: any = undefined;
    if (file) {
      const sizeKB = (file.size / 1024).toFixed(1) + " KB";
      if (file.type.startsWith("image/")) {
        fileAttachment = { name: file.name, type: file.type, size: sizeKB, base64: await fileToBase64(file) };
      } else {
        fileAttachment = { name: file.name, type: file.type, size: sizeKB, textContent: await fileToText(file) };
      }
    }
    removeImage();

    const convId = await chatStore.addChat(promptText, fileAttachment);
    if (convId) router.push("/" + convId);
  } catch (err) {
    console.error("Send error:", err);
  } finally {
    isLoading.value = false;
  }
};

defineProps({ isChatStarted: { type: Boolean, default: false } });
const emit = defineEmits(["isChatStarted"]);
</script>