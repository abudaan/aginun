<template>
  <v-app>
    <the-app-bar />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
  import TheAppBar from "@/components/TheAppBar.vue";
  // import { Test4 } from "@/apollo/gql/other.gql";

  export default {
    name: "App",
    // apollo: {
    //   test: {
    //     query: Test4,
    //     data: data => {
    //       console.log(data);
    //     },
    //   },
    // },
    components: {
      TheAppBar,
    },
    data: () => ({
      drawer: null, // vuetify determines initial state based on screen size
    }),
  };
</script>

<style lang="scss" scoped></style>
