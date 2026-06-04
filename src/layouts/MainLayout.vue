<template>
  <v-app>
    <div class="layout flex">
      <Sidebar />

      <v-main class="content flex-1 w-full md:w-auto overflow-hidden">
        <router-view />
      </v-main>
    </div>

  </v-app>
</template>

<script setup>
import Sidebar from '@/components/common/sidebar/SideBar.vue'
</script>

<style scoped>
.layout {
  display: flex;
  width: 100%;
  height: 100vh;
}

.content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

@media (max-width: 768px) {
  .layout {
    position: relative;
    flex-direction: row;
  }
  
  .content {
    width: 100%;
  }
}
</style>