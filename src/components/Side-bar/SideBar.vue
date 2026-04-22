<template>


  <v-navigation-drawer permanent class="px-4 d-flex flex-column bg-white rounded-lg">
 
    <img :src="chatGPTIcon" alt="Logo" class="w-[20px] h-[20px] mb-9 mt-9" />

    <div class="ma-2 flex gap-2 items-center justify-start mb-4" color="">
      <img :src="newChatIcon" alt="Logo" class="w-[20px] h-[20px]" />
      New Chat
    </div>

    <div class="ma ml-1 mb-4 flex gap-2 items-center justify-start" color="">
      <img :src="search" alt="search" class="w-[20px] h-[20px]" />
      Search chats
    </div>

        <div class="ma ml-1 flex gap-2 items-center justify-start" color="">
      <img :src="library" alt="library" class="w-[20px] h-[20px]" />
      Library
    </div>

    <v-list nav>
      <v-list-item v-for="chat in chats" :key="chat.id" :to="`/chat/${chat.id}`" active-class="bg-grey-lighten-3">
        <v-list-item-title class="text-truncate">
          {{ chat.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>

<script setup>
const chats = [
  { id: 1, title: "Vue Router help" },
  { id: 2, title: "Vuetify sidebar design" },
  { id: 3, title: "Build ChatGPT clone" },
  { id: 4, title: "JavaScript tips" },
]

import newChatIcon from "@/assets/img/new-chat.svg";
import chatGPTIcon from "@/assets/img/chat-GPT.svg";
import search from "@/assets/img/search.svg";
import library from "@/assets/img/library.svg";

</script>