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

<script lang="ts">
import { defineComponent, ref, provide } from '@nuxtjs/composition-api';
import AuthKey from "@/composables/i/use-auth-key";
import useAuth from "@/composables/i/use-auth";

export default defineComponent({
  setup(ctx) {
    provide(AuthKey, useAuth(ctx));

    const title = ref('Nuxt Sandbox');

    return {
      title
    };
  },
})
</script>


<style>
body::-webkit-scrollbar {
  display: none;
}
</style>
