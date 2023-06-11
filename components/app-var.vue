<template>
  <v-app-bar
    app
    fixed
    flat
    dense
    color="white"
  >
    <v-toolbar-title>{{ title }}</v-toolbar-title>

    <v-spacer />

    <v-btn icon :ripple="false">
      <v-icon>mdi-cog</v-icon>
    </v-btn>

    <div>isLogined: {{ isLogined }}</div>

    <v-btn
      text
      small
      :ripple="false"
      @click="onClickLogout"
    >
      ログアウト
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, useRouter, inject } from '@nuxtjs/composition-api';
import AuthStoreKey from "@/composables/i/use-auth-key";
import _, { AuthStoreType } from "@/composables/i/use-auth";

export default defineComponent({
  setup() {
    const router = useRouter();

    const title = ref('Nuxt Sandbox');

    const { user, isLogined, logout, confirmAuth } = inject(AuthStoreKey) as AuthStoreType;

    onBeforeMount(() => {
      // confirmAuth();
      // console.log('user: ', user)
    });

    const onClickLogout = () => {
      if (logout()) {
        router.push('/login');
      } else {
        console.log('error in logout');
      }
    }

    return {
      // data
      title,
      isLogined,

      // イベントハンドラ
      onClickLogout
    }
  },
})
</script>


<style>
body::-webkit-scrollbar {
  display: none;
}
</style>
