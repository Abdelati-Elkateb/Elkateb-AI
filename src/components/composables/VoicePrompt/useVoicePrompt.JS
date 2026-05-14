


const export default useServerSeoMeta({
    const emit = defineEmits(['onResult']);

const showModal = ref(false);

const { isListening, result, start, stop } = useSpeechRecognition({
  lang: 'ar-SA',
  continuous: true,
});

const startListening = () => {
  showModal.value = true;
  result.value = '';
  start();
};

const stopListening = () => {
  stop();
  showModal.value = false;
};

const confirmText = () => {
  if (result.value) {
    emit('onResult', result.value);
  }
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

  
})