<template>
  <v-app>
    <v-app-bar
      app
      fixed
      flat
      dense
      color="white"
    >
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>

    <v-footer
      app
      absolute
      color="white"
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      title: 'Nuxt Sandbox'
    }
  }
}
</script>

<style>
body::-webkit-scrollbar {
  display: none;
}
</style>
