<template>
  <div>
    <div :style="containerMargin">
      <div class>
        <div class="text-center my-8">
          <h1>
            Find positions at
            <span class="xr-title">Extinction Rebellion Nederland.</span>
          </h1>
        </div>
        <div
          v-if="$vuetify.breakpoint.smAndDown"
          class="mb-8"
        >
          <v-divider />
          <div class="d-flex justify-end pa-3">
            <v-btn
              text
              color="primary"
              @click="drawer = true"
            >
              Filter
            </v-btn>
          </div>
          <v-divider />
        </div>
      </div>
      <div class="d-flex flex-wrap justify-center">
        <role-card
          v-for="role in roles"
          :key="role.id"
          :role="role"
        />
        <div
          v-if="roleAmount < 1"
          class="pa-5 text-center"
        >
          <h3>No results.</h3>
          <p>Try removing filters.</p>
        </div>
      </div>
    </div>
    <filter-drawer
      v-model="drawer"
      :width="drawerWidth"
      :role-amount="roleAmount"
    />
  </div>
</template>

<script>
import RoleCard from "@/components/RoleCard.vue";
import FilterDrawer from "@/components/FilterDrawer";
import { mapGetters, mapState, mapMutations } from "vuex";
import {localGroupNames, workingGroupNames, getLocalGroupIds, getWorkingGroupIds} from "@/gql/queries_local.gql";
import { getRoles } from "@/gql/queries_remote.gql";
import gql from "graphql-tag";


export default {
  name: "Explore",
  components: {
    RoleCard,
    FilterDrawer
  },
  data: () => ({
    drawer: null,
    drawerWidth: 400
  }),
  computed: {
    ...mapState("filters", [
      "limit",
      "search",
      "roleAmount"
    ]),
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
  apollo: {
    localGroups: {
      query: localGroupNames,
      update: ({ localGroupNames }) => localGroupNames
    },
    workingGroups: {
      query: workingGroupNames,
      update: ({ workingGroupNames }) => workingGroupNames
    },
    roles: {
      query: getRoles,
      update: function(data) {
        const roles = data.role.map(role => ({
          id: role.id,
          title: role.name,
          timeCommitment: [role.time_commitment_min, role.time_commitment_max],
          localGroup: {
            text: role.local_group.name
          },
          workingGroup: {
            text: role.working_group.name
          },
          location: role.location
        }));
        this.$store.commit("filters/update", {
          key: "roleAmount",
          value: roles.length
        });
        return roles;
      },
      variables: function() {
        return {
          limit: this.limit,
          search: this.search,
          localGroupIds: this.localGroupIds,
          workingGroupIds: this.workingGroupIds,
          timeCommitmentMin: this.selectedTimeCommitment[0],
          timeCommitmentMax: this.selectedTimeCommitment[1]
        };
      },
      error: error => {
        console.error("[GraphQL]", error);
      }
    },
    localGroupIds: {
      query: getLocalGroupIds,
      variables: function() {
        return {
          selectedNames: this.localGroups.length === 0 ? null : this.localGroups
        };
      },
      update: function(data) {
        return data.local_group.map(({ id }) => id);
      }
    },
    workingGroupIds: {
      query: getWorkingGroupIds,
      variables: function() {
        return {
          selectedNames:
            this.workingGroups.length === 0 ? null : this.workingGroups
        };
      },
      update: function(data) {
        return data.working_group.map(({ id }) => id);
      }
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
