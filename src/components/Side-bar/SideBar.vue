<template>
      <v-app>
    <!-- Sidebar -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item title="Dashboard" prepend-icon="mdi-view-dashboard" />
        <v-list-item title="Users" prepend-icon="mdi-account" />
        <v-list-item title="Settings" prepend-icon="mdi-cog" />
      </v-list>
    </v-navigation-drawer>

    <!-- Top Bar -->
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>My App</v-toolbar-title>
    </v-app-bar>

    <!-- Content -->
    <v-main>
      <v-container>
        <h1>Welcome 👋</h1>
      </v-container>
    </v-main>
  </v-app>
</template>