<template>
  <v-app>
    <v-container style="height: 100%;">
      <v-row
        justify="center"
        align="center"
        style="height: 100%;"
      >
        <v-col cols="12" style="height: 100%;">
          <v-card flat>
            <v-card-title v-if="error.statusCode === 404">
              {{ pageNotFound }}
            </v-card-title>

            <v-card-title v-else>
              {{ otherError }}
            </v-card-title>

            <v-card-text>
              <NuxtLink to="/">
                Home page
              </NuxtLink>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
