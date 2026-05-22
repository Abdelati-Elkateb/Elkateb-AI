<template>
  <v-app>

    <div class="layout">
      <Sidebar />

      <v-main class="content">
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
}
</style>