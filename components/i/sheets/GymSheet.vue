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
    const { isLogined, user, instructor, gym, confirmAuth, fetchInstructor, fetchGyms, fetchGym } = inject(AuthStoreKey) as AuthStoreType;
    const router = useRouter()
    const { error } = useContext()

    const showable = computed(() => {
      if (router.currentRoute.name === 'i-gyms') {
        return isLogined.value && (instructor.value || (user.value && (user.value.approved || user.value.registered || user.value.admin)))
      } else {
        return isLogined.value && gym.value && (instructor.value || (user.value && user.value.admin))
      }
    })

    onBeforeMount(() => {
      confirmAuth().then(async () => {
        if (user.value) {
          // ログイン済み
          const q = router.currentRoute.query
          const gymID: any = q.gymID;

          if (gymID) {
            // ジムの存在確認
            await fetchGym({ gymID: gymID });
            if (!gym.value) {
              return error({ statusCode: 404 })
            }

            // ジムのインストラクターかの確認
            await fetchInstructor({ userID: user.value.id, gymID: gymID })
            if (!user.value.admin && !instructor.value) {
              return error({ statusCode: 404 })
            }
          } else {
            if (router.currentRoute.name === 'i-gyms') {
              // ジム一覧画面の場合はジム一覧を取得
              const gymIDs = user.value.gymsFromInstructor
              fetchGyms({ gymIDs: gymIDs })
            } else {
              // ジム一覧画面以外の場合、gymIDの指定がないと404
              return error({ statusCode: 404 })
            }
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
