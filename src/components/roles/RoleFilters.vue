<template>
  <div>
    <div>
      <v-text-field
        :value="filter.searchString"
        label="Facilitator, Writer, Photographer..."
        class="mt-3"
        @input="value => onSetFilter(value, 'text')"
      />
    </div>
    <filter-section>
      <template v-slot:title>
        Groups
      </template>
      <flex-wrapper direction="column">
        <autocomplete-custom
          :items="localGroups"
          label="Local Group"
          @change="id => onSetFilter(id, 'localGroup')"
        />
        <autocomplete-custom
          :items="workingGroups"
          label="Working Group"
          @change="id => onSetFilter(id, 'workingGroup')"
        />
      </flex-wrapper>
    </filter-section>
    <filter-section>
      <template v-slot:title>
        Time commitment
      </template>
      <v-range-slider
        :value="filter.selectedTimeCommitment"
        :min="filter.timeCommitmentRangeMin"
        :max="filter.timeCommitmentRangeMax"
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
    GetFilter,
    // mutations
    UpdateTimeCommitmentRangeRole,
    UpdateLocalGroups,
    UpdateWorkingGroups,
    UpdateSearchString,
    ClearFilter,
  } from "@/apollo/gql/role.gql";

  export default {
    name: "RoleFilters",
    components: {
      filterSection: FilterDrawerSection,
      AutocompleteCustom,
      FlexWrapper,
    },
    // beforeCreate: () => {
    //   console.log();
    // },
    apollo: {
      navbarHeight: {
        query: NavbarHeight,
        update: data => data.navbarHeight,
      },
      filter: {
        query: GetFilter,
        update: data => {
          const {
            roleData: { filter },
          } = data;
          return {
            ...filter,
            searchString: filter.searchString
              ? filter.searchString.replace(/%/g, "")
              : null,
            selectedTimeCommitment: [
              filter.selectedTimeCommitmentMin,
              filter.selectedTimeCommitmentMax,
            ],
          };
        },
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
        update: data => {
          // console.log(data);
          return data.getRoleData.timeCommitmentRange;
        },
        // update: data => data.getRoleData.timeCommitmentRange,
      },
    },
    methods: {
      clearFilter: function() {
        this.$apollo.mutate({
          mutation: ClearFilter,
        });
      },
      onSetFilter: function(value, key) {
        // console.log(key, value);
        if (key === "localGroup") {
          this.$apollo.mutate({
            mutation: UpdateLocalGroups,
            variables: { names: value },
          });
        } else if (key === "workingGroup") {
          this.$apollo.mutate({
            mutation: UpdateWorkingGroups,
            variables: { names: value },
          });
        } else if (key === "timeCommitment") {
          this.$apollo.mutate({
            mutation: UpdateTimeCommitmentRangeRole,
            variables: { range: value },
          });
        } else if (key === "text") {
          this.$apollo.mutate({
            mutation: UpdateSearchString,
            variables: { search: value },
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped></style>
