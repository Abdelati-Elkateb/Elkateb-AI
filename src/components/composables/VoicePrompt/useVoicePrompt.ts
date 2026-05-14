import { ref } from 'vue';
import { useSpeechRecognition } from '@vueuse/core';

export const useVoicePrompt = () => {


  const showModal = ref(false);
  const { isListening, result, start, stop } = useSpeechRecognition({
    lang: 'en-US',
    continuous: true,
  });

  const startListening = () => {
    showModal.value = true;
    result.value = '';
    start();
    alert("jjjj")
  };

  const stopListening = () => {
    stop();
    showModal.value = false;
  };

  const confirmText = () => {
    stopListening();
  };

  return {
    showModal,
    isListening,
    result,
    startListening,
    stopListening,
    confirmText,
  };
};