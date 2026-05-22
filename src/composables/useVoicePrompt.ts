import { ref } from 'vue'

export function useVoicePrompt() {
  const showModal = ref(false)
  const isListening = ref(false)
  const result = ref('')

  let recognition: any = null

  const startListening = () => {
    showModal.value = true
    isListening.value = true

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onresult = (ev: any) => {
        const transcript = ev.results?.[0]?.[0]?.transcript
        if (transcript) result.value = transcript
      }

      recognition.onend = () => {
        isListening.value = false
      }

      recognition.onerror = () => {
        isListening.value = false
      }

      try {
        recognition.start()
      } catch (e) {
        // ignore start errors
        isListening.value = false
      }
    } else {
      // Fallback: simulate voice input for environments without SpeechRecognition
      result.value = ''
      setTimeout(() => {
        result.value = ''
        isListening.value = false
      }, 1200)
    }
  }

  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop()
      } catch (e) {
        // ignore
      }
      recognition = null
    }
    isListening.value = false
    showModal.value = false
  }

  const confirmText = () => {
    showModal.value = false
    isListening.value = false
  }

  return {
    showModal,
    isListening,
    result,
    startListening,
    stopListening,
    confirmText,
  }
}

export default useVoicePrompt
