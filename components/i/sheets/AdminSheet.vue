<template>
  <v-app v-show="showable">
    <slot />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed, inject, onBeforeMount, useRouter, useContext } from '@nuxtjs/composition-api';
import AuthStoreKey from "@/composables/i/use-auth-key";
import { AuthStoreType } from "@/composables/i/use-auth";

export default defineComponent({
  name: 'GymSheet',
  setup() {
    const { isLogined, user, confirmAuth } = inject(AuthStoreKey) as AuthStoreType;
    const router = useRouter()
    const { error } = useContext()

    const showable = computed(() => {
      return isLogined.value && user.value && user.value.admin
    })

    onBeforeMount(() => {
      confirmAuth().then(async () => {
        if (user.value) {
          // ログイン済み
          if (!user.value.admin) {
            return error({ statusCode: 404 })
          }
        } else {
          // 未ログイン
          return router.push('/i/login');
        };
      });
    });

    return {
      showable,
    };
  },
})
</script>
