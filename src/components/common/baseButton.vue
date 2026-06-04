<template>
  <form
    @submit.prevent="sendMessage"
    class="bg-[#ffffff] flex flex-col border border-gray-100 w-full md:w-[70%] shadow-lg py-2 md:py-4 overflow-hidden !rounded-3xl md:!rounded-4xl px-2 md:px-4 focus-within:ring-2 focus-within:ring-gray-100 h-auto"
  >
    <input
      v-model="userInput"
      type="text"
      placeholder="Write your prompt here"
      class="w-full focus:outline-none mb-2 md:mb-4 text-sm md:text-base"
      :disabled="isLoading"
    />

    <div class="flex gap-1 md:gap-3 items-center bg flex-wrap md:flex-nowrap justify-end">
      <div class="ml-auto flex gap-1 md:gap-2 items-center">
        <VoicePrompt ref="voicePromptRef" />

        <div
          @click="openVoiceModal"
          class="h-8 md:h-[40px] w-8 md:w-[40px] bg-[#333] rounded-full flex items-center justify-center cursor-pointer hover:bg-black transition-colors"
        >
          <img :src="recorder" alt="recorder" class="w-3 md:w-[18px] h-3 md:h-[18px]" />
        </div>

        <button type="submit" :disabled="isLoading" class="hidden"></button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import recorder from "@/assets/img/Vector.svg";
import VoicePrompt from "@/components/common/VoicePrompt.vue";
import { useChatStore } from "@/stores/useChatStore";
import { useRouter } from "vue-router";

const chatStore = useChatStore();
const router = useRouter();


const voicePromptRef = ref<InstanceType<typeof VoicePrompt> | null>(null);

const userInput = ref("");
const isLoading = ref(false);
const isChatStarted = ref(false);
const replyMas = ref([]);



const openVoiceModal = () => {
  voicePromptRef.value?.startListening();
};

const messages = ref<{ role: "user" | "assistant"; content: string }[]>([]);

const sendMessage = async () => {
  const promptText = userInput.value.trim();
  if (!promptText || isLoading.value) return;
  isChatStarted.value = true;
  emit("isChatStarted", isChatStarted.value);
  
  userInput.value = "";
  
  const convId = await chatStore.addChat(promptText);
  
  if (convId) {
    router.push('/' + convId);
  }
}


const props = defineProps({
  isChatStarted: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["isChatStarted"]);
</script>