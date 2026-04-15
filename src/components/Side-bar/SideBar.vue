<template>
  <v-navigation-drawer width="280" permanent>

    <v-btn block class="ma-2" color="primary">
      + New Chat
    </v-btn>

    <v-list nav>
      <v-list-item
        v-for="chat in chats"
        :key="chat.id"
        :to="`/chat/${chat.id}`"
        active-class="bg-grey-lighten-3"
      >
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
</script>