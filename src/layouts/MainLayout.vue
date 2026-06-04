<template>
  <v-app>
    <!-- Modern Vuetify apps use v-layout to naturally handle sidebars and content zones -->
    <v-layout class="w-full h-screen overflow-hidden">
      
      <!-- Your custom sidebar -->
      <Sidebar />

      <!-- v-main automatically calculates padding based on the sidebar's size -->
      <v-main class="content-wrapper">
        <div class="router-container">
          <router-view />
        </div>
      </v-main>

    </v-layout>
  </v-app>
</template>

<script setup>
import Sidebar from '@/components/common/sidebar/SideBar.vue'
</script>

<style scoped>
/* Ensures the v-main element takes up 100% height and doesn't create unwanted double-scrollbars */
.content-wrapper {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Acts as a rigorous container for your inner router views (like the chat interface) */
.router-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

@media (max-width: 768px) {
  /* Handle mobile structural overrides if your Sidebar doesn't natively use v-navigation-drawer */
  .content-wrapper {
    width: 100%;
  }
}
</style>