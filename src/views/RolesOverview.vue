<template>
  <div>
    <router-view :key="$route.fullPath" />
    <div :style="containerMargin">
      <div class>
        <div class="text-center my-8">
          <h1>
            Find positions at
            <span class="xr-title">Extinction Rebellion Nederland.</span>
          </h1>
        </div>
        <div v-if="$vuetify.breakpoint.smAndDown" class="mb-8">
          <v-divider />
          <div class="d-flex justify-end pa-3">
            <v-btn text color="primary" @click="drawer = true">
              Filter
            </v-btn>
          </div>
          <v-divider />
        </div>
      </div>
      <div class="d-flex flex-wrap justify-center">
        <role-card v-for="role in roles" :key="role.id" :role="role" />
        <div v-if="roleAmount < 1" class="pa-5 text-center">
          <h3>No results.</h3>
          <p>Try removing filters.</p>
        </div>
      </div>
    </div>
    <filter-drawer v-model="drawer" :width="drawerWidth" />
  </div>
</template>

<script>
import RoleCard from "@/components/roles/RoleCard.vue";
import FilterDrawer from "@/components/FilterDrawer";
import { RolesFromClient, RoleAmount } from "@/gql/role.gql";

export default {
  name: "RolesOverview",
  components: {
    RoleCard,
    FilterDrawer
  },
  data: () => ({
    drawer: null,
    drawerWidth: 400
  }),
  computed: {
    containerMargin: function() {
      if (this.drawer && !this.isMobile) {
        return { "margin-right": this.drawerWidth + "px" };
      } else {
        return {};
      }
    },
    isMobile: function() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  // beforeCreate: () => {
  //   console.log(RolesFromClient);
  // },
  apollo: {
    roles: {
      query: RolesFromClient,
      update: data => data.roles
    },
    roleAmount: {
      query: RoleAmount
    }
  },
  watch: {
    isMobile: function() {
      this.drawer = !this.isMobile;
    }
  },
  created: function() {
    this.drawer = !this.isMobile;
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.xr-title {
  font-family: "FUCXEDCAPS";
}
</style>
