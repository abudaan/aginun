<template>
  <div>
    <v-dialog
      persistent
      max-width="750"
      value="true"
      @click:outside="$router.push('/roles')"
      @keydown.escape="$router.push('/roles')"
    >
      <v-card v-if="!!role" class="role card">
        <v-card-title>
          <flex-wrapper direction="column">
            <h2 class="role title">
              {{ role.name }}
            </h2>
            <flex-wrapper v-if="role.working_group || role.local_group">
              <h5 class="role subtitle">
                {{ role.working_group.name }}
                <span style="margin: 0 0.25rem;">- </span>
                {{ role.local_group.name }}
              </h5>
            </flex-wrapper>
          </flex-wrapper>
        </v-card-title>
        <v-divider />
        <v-card-text class="role text">
          <flex-wrapper>
            <div class="role description">
              <p>{{ role.description }}</p>
              <div v-if="!!role.responsibilities">
                <h4>Responsibilities</h4>
                <p>{{ role.responsibilities }}</p>
              </div>
            </div>
            <div class="role sidebar">
              <meta-info
                v-if="!!role.time_commitment_min"
                title="Time Commitment"
                :description="
                  `${role.time_commitment_min} -
                ${role.time_commitment_max} hours/week`
                "
              />
              <meta-info
                v-if="!!role.contact_details"
                title="Contact Details"
                :description="role.contact_details"
              />
            </div>
          </flex-wrapper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import FlexWrapper from "../layout/FlexWrapper";
import MetaInfo from "../layout/MetaInfo";
import { RoleDetailFromClient } from "@/gql/queries.gql";
export default {
  components: {
    FlexWrapper,
    MetaInfo
  },
  data() {
    return {
      dialog: true
    };
  },
  apollo: {
    role: {
      query: RoleDetailFromClient,
      variables: function() {
        return { id: this.$route.params.id };
      },
      update: data => data.roleDetail
    }
  }
};
</script>
<style lang="scss" scoped>
.role {
  &.text {
    margin-top: 1rem;
    color: #222 !important;
  }
  &.title {
    font-size: 1.5rem !important;
    font-weight: bold;
  }
  &.subtitle {
    font-weight: normal;
  }
  &.description {
    flex-basis: 66%;
    flex: 6;
  }
  &.sidebar {
    margin-left: 1rem;
    flex-basis: 33%;
    flex: 3;
  }
}
</style>
