<template>
  <v-container style="height: 100%;">
    <div>TOP</div>
    <div>isLogined: {{ isLogined }}</div>
    <div>uid: {{ currentUser?.uid }}</div>
    <div>displayName: {{ currentUser?.displayName }}</div>
    <div>userID: {{ user?.id }}</div>
    <div>admin: {{ user?.admin }}</div>
    <div>approved: {{ user?.approved }}</div>
    <div>registered: {{ user?.registered }}</div>

    <v-row
      justify="center"
      align="center"
      style="height: 100%;"
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <v-btn
          rounded
          large
          elevation="4"
          color="white"
          style="text-transform: none"
          @click="onClickGoogleLogout"
        >
          <v-icon left>
            mdi-google
          </v-icon>
          Sign out with Google
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeMount, useRouter } from "@nuxtjs/composition-api";
import { AuthStoreType } from "@/composables/i/use-auth";
import AuthKey from "@/composables/i/use-auth-key";

export default defineComponent({
  layout: 'default',
  setup() {
    const { isLogined, currentUser, user, confirmAuth, logout } = inject(AuthKey) as AuthStoreType;

    onBeforeMount(() => {
      confirmAuth()
    })

    const onClickGoogleLogout = () => {
      logout()
    };

    return {
      isLogined,
      currentUser,
      user,
      onClickGoogleLogout,
    };
  },
})
</script>

