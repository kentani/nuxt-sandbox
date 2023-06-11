<template>
  <AdminSheet>
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
  </AdminSheet>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from '@nuxtjs/composition-api';
import AuthStoreKey from "@/composables/i/use-auth-key";
import AuthStore from "@/composables/i/use-auth";

import AdminSheet from "@/components/i/sheets/AdminSheet.vue"

export default defineComponent({
  components: {
    AdminSheet,
  },
  setup(ctx) {
    provide(AuthStoreKey, AuthStore(ctx));

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
