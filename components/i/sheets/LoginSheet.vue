<template>
  <v-app v-show="showable">
    <slot />
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onBeforeMount, reactive, useRouter } from '@nuxtjs/composition-api';
import AuthStoreKey from "@/composables/i/use-auth-key";
import { AuthStoreType } from "@/composables/i/use-auth";

export default defineComponent({
  name: 'ApplySheet',
  setup() {
    const { isLogined, user, confirmAuth } = inject(AuthStoreKey) as AuthStoreType;
    const router = useRouter()

    let state = reactive({
      showable: false
    });

    let showable = computed(() => {
      return state.showable
    })

    onBeforeMount(() => {
      confirmAuth().then(() => {
        if (user.value) {
          // ログイン済み
          if (user.value.admin) {
            // 管理者
            return router.push('/admin/menus');
          } else if (user.value.approved || user.value.registered) {
            // 承認済み || 登録済み
            if (user.value.gymsFromInstructor.length === 1) {
              // 所属しているジムが一つの場合は、メニュー画面に遷移
              return router.push({ path: '/i/menus', query: { gymID: user.value.gymsFromInstructor[0] } });
            } else {
              // 所属しているジムが複数 or 0の場合は、ジム一覧画面に遷移
              return router.push('/i/gyms');
            }
          } else {
            // 未承認 && 未登録
            return router.push('/i/apply');
          }
        } else {
          state.showable = true
          // 未ログイン
          // ログイン画面のまま
        };
      });
    });

    return {
      showable,
    };
  },
})
</script>
