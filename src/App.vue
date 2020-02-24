<template>
  <v-app>
    <!-- <the-app-bar />
    <v-content>
      <router-view />
    </v-content> -->
  </v-app>
</template>

<script>
  // import TheAppBar from "@/components/TheAppBar.vue";
  import { Test, Test2, Test3 } from "@/apollo/gql/other.gql";
  import { GetRoleData } from "@/apollo/gql/role.gql";

  export default {
    name: "App",
    apollo: {
      // test1: {
      //   query: Test,
      //   update: data => {
      //     console.log(data);
      //     return data;
      //   },
      // },
      // test2: {
      //   query: Test2,
      //   update: data => {
      //     console.log(data);
      //     return data;
      //   },
      // },
      test3: {
        query: Test3,
        update: data => {
          console.log(data);
          return data;
        },
      },
      role: {
        query: GetRoleData,
        update: data => {
          console.log(data);
          return data;
        },
      },
    },
    // components: {
    //   TheAppBar,
    // },
    data: () => ({
      drawer: null, // vuetify determines initial state based on screen size
    }),
  };
</script>

<style lang="scss" scoped></style>
