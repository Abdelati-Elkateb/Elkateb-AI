<template>
  <div class="bg-white flex flex-col border border-gray-100 w-[70%] shadow-lg py-4 rounded-4xl px-4 h-auto">
    <!-- The Input Field -->
    <input v-model="userInput" type="text" placeholder="ask anything" class="w-full focus:outline-none" />

    <div class="flex gap-3 items-center mt-4">
      <div class="ml-auto flex gap-2 items-center">
        <!-- The Trigger Button (Microphone) -->
        <div @click="startListening"
          class="h-[50px] w-[50px] bg-[#333] rounded-full flex items-center justify-center cursor-pointer">
          <img :src="recorder" alt="recorder" class="w-[20px] h-[20px]" />
        </div>
      </div>
    </div>

    <!-- The Modal Component -->

    <VoicePrompt :show-modal="showModal" :is-listening="isListening" :result="result" @close="stopListening"
      @confirm="handleConfirm" />
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import recorder from "@/assets/img/Vector.svg";
import VoicePrompt from "@/components/common/VoicePrompt.vue";
import { useVoicePrompt } from "@/components/composables/VoicePrompt/useVoicePrompt";

const userInput = ref('');
const { showModal, isListening, result, startListening, stopListening } = useVoicePrompt();

const handleConfirm = () => {
  if (result.value) {
    userInput.value = result.value;
  }
  stopListening();
};
</script>