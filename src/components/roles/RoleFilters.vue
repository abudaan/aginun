<template>
  <div>
    <div>
      <v-text-field
        :value="searchString"
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
        :value="selectedTimeCommitment"
        :min="timeCommitmentRange.min"
        :max="timeCommitmentRange.max"
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
    RoleAmount,
    SearchString,
    SelectedTimeCommitment,
    AggregateTimeCommitmentRangeClient,
    UpdateTimeCommitmentRange,
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
    data: () => ({
      timeCommitmentRange: { min: 0, max: 20 },
      selectedTimeCommitment: [10, 20],
    }),
    // beforeCreate: () => {
    //   console.log();
    // },
    apollo: {
      navbarHeight: {
        query: NavbarHeight,
        update: data => data.navbarHeight,
      },
      searchString: {
        query: SearchString,
        update: data => data.searchString,
      },
      roleAmount: {
        query: RoleAmount,
        update: data => data.roleAmount,
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
      selectedTimeCommitment: {
        query: SelectedTimeCommitment,
        update: data => data.selectedTimeCommitment,
      },
      timeCommitmentRange: {
        query: AggregateTimeCommitmentRangeClient,
        // update: data => {
        //   console.log(data);
        // },
        update: data => data.roleClient.timeCommitmentRange,
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
            mutation: UpdateTimeCommitmentRange,
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
