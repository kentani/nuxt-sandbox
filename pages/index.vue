<template>
  <v-container>
    <div>index</div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@nuxtjs/composition-api';
import { getAuth, signInWithPopup, onAuthStateChanged, GoogleAuthProvider, signOut } from "firebase/auth";

export default defineComponent({
  setup() {
    onMounted(() => {
      // const auth = getAuth();
      // const user = auth.currentUser;
      // console.log('user3: ', user)

      // checkLogin();

      // signOut(auth).then(() => {
      //   // Sign-out successful.
      // }).catch((error) => {
      //   // An error happened.
      // });
    })

    const checkLogin = () => {
      const auth = getAuth();
      let currentUser: any;

      onAuthStateChanged(auth, (user) => {
        if (user) {
          currentUser = auth.currentUser;
        }
      });

      return currentUser;
    }

    const login = () => {
      const auth = getAuth();

      signInWithPopup(auth, new GoogleAuthProvider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          const user = result.user;
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
        });
    }

    const logout = () => {
      const auth = getAuth();

      signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
    }
  },
})
</script>

