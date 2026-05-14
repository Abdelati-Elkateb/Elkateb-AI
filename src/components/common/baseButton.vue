<template>
  <div
    class="bg-[#ffffff] flex flex-col border border-gray-100 w-[70%] shadow-lg py-4 overflow-hidden !rounded-4xl px-4 focus:outline-none focus:ring-2 focus:ring-gray-100 h-[auto]"
  >
    <input
      type="text"
      placeholder="ask anything"
      class="w-full focus:outline-none"
    />


    <div class="flex-1"></div>


    <div class="flex gap-3 items-center">
      <div>
        <label for="file-upload" class="py-2 rounded-lg cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-5"
          >
            <path
              d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
            />
          </svg>
        </label>

        <input type="file" id="file-upload" class="hidden" />
      </div>

      <div class="ml-auto flex gap-2 items-center">
        <VoicePrompt iconClass="w-10 h-10" />

        <div
          class="h-[50px] w-[50px] bg-[#333] rounded-full flex items-center justify-center cursor-pointer"
        >
          <img
            :src="recorder"
            alt="recorder"
            class="w-[20px] h-[20px] object-contain"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MicrophoneIcon } from "@heroicons/vue/24/solid";
import recorder from "@/assets/img/Vector.svg";
import VoicePrompt from "@/components/common/VoicePrompt.vue";



</script> 