<template>
  <div>
    <div>
      <v-text-field
        :value="filter.searchString"
        label="Facilitator, Writer, Photographer..."
        class="mt-3"
        @input="value => onSetFilter(value, 'searchString')"
      />
    </div>
    <filter-section>
      <template v-slot:title>
        Groups
      </template>
      <flex-wrapper direction="column">
        <autocomplete-custom
          :value="filter.selectedLocalGroups"
          :items="localGroups"
          label="Local Group"
          @change="id => onSetFilter(id, 'localGroups')"
        />
        <autocomplete-custom
          :value="filter.selectedWorkingGroups"
          :items="workingGroups"
          label="Working Group"
          @change="id => onSetFilter(id, 'workingGroups')"
        />
      </flex-wrapper>
    </filter-section>
    <filter-section>
      <template v-slot:title>
        Time commitment
      </template>
      <v-range-slider
        :value="filter.selectedTimeCommitment"
        :min="timeCommitmentRange[0]"
        :max="timeCommitmentRange[1]"
        class="mt-12"
        thumb-label="always"
        label="Time Commitment"
        @change="id => onSetFilter(id, 'timeCommitment')"
      />
    </filter-section>
  </div>
</template>

<script>
import FlexWrapper from "@/components/layout/FlexWrapper.vue";
import AutocompleteCustom from "@/components/AutocompleteCustom";
import FilterDrawerSection from "../layout/FilterDrawerSection";
import {
  NavbarHeight,
  LocalGroups,
  WorkingGroups,
} from "@/apollo/gql/other.gql";
import {
  // queries
  GetTimeCommitmentRangeRole,
  GetRoleFilter,
  // mutations
  UpdateRoleFilter,
  ClearFilter,
} from "@/apollo/gql/role.gql";

export default {
  name: "RoleFilters",
  components: {
    filterSection: FilterDrawerSection,
    AutocompleteCustom,
    FlexWrapper,
  },
  data: () => ({
    // extra data field is required until this issue has been fixed:
    // https://github.com/vuejs/vue-apollo/issues/854
    filter: {},
    timeCommitmentRange: [],
  }),
  apollo: {
    navbarHeight: {
      query: NavbarHeight,
      update: data => data.navbarHeight,
    },
    filter: {
      query: GetRoleFilter,
      update: data => data.getRoleData.filter,
    },
    localGroups: {
      query: LocalGroups,
      update: data =>
        data.local_group.map(({ id, name }) => ({ id, text: name })),
    },
    workingGroups: {
      query: WorkingGroups,
      update: data =>
        data.working_group.map(({ id, name }) => ({ id, text: name })),
    },
    timeCommitmentRange: {
      query: GetTimeCommitmentRangeRole,
      update: data => data.getRoleData.timeCommitmentRange,
    },
  },
  methods: {
    clearFilter: function() {
      this.$apollo.mutate({
        mutation: ClearFilter,
      });
    },
    onSetFilter: function(value, key) {
      this.$apollo.mutate({
        mutation: UpdateRoleFilter,
        variables: { [key]: value },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
