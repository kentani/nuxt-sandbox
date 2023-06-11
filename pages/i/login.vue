<template>
  <v-container style="height: 100%;">
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
          @click="onClickGoogleLogin"
        >
          <v-icon left>
            mdi-google
          </v-icon>
          Sign in with Google
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, inject, useRouter } from "@nuxtjs/composition-api";
import { AuthStoreType } from "@/composables/i/use-auth";
import AuthKey from "@/composables/i/use-auth-key";

export default defineComponent({
  layout: 'i-login',
  setup() {
    const { isLogined, login } = inject(AuthKey) as AuthStoreType;

    const router = useRouter()

    const onClickGoogleLogin = () => {
      login().then(() => {
        router.push('/i/apply');
      })
    };

    return {
      isLogined,
      onClickGoogleLogin
    };
  },
})
</script>
