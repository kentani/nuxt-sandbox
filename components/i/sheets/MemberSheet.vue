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
  name: 'MemberSheet',
  setup() {
    const { isLogined, user, instructor, gym, member, confirmAuth, fetchInstructor, fetchGym, fetchMembers, fetchMember } = inject(AuthStoreKey) as AuthStoreType;
    const router = useRouter()
    const { error } = useContext()

    const showable = computed(() => {
      if (router.currentRoute.name === 'i-members') {
        return isLogined.value && gym.value && (instructor.value || (user.value && user.value.admin))
      } else {
        return isLogined.value && gym.value && member.value && (instructor.value || (user.value && user.value.admin))
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

            const memberID: any = q.memberID;

            if (memberID) {
              // メンバーの存在確認
              fetchMember({ gymID: gymID, memberID: memberID })
              if (!member.value) {
                return error({ statusCode: 404 })
              }
            }

            if (router.currentRoute.name === 'i-members') {
              // 顧客一覧画面の場合は顧客一覧を取得
              fetchMembers({ gymID: gymID })
            }
          } else {
            // gymIDの指定がないと404
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
