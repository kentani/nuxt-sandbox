<template>
  <v-container>
    <v-card flat>
      <v-card-title>
        承認待ち
      </v-card-title>

      <v-card-text class="text-body-1">
        <div>管理者の承認待ちです。</div>
        <div>管理者が承認後、利用を開始できます。</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  layout: 'i-apply',
  setup() {
    return {}
  },
})
</script>
