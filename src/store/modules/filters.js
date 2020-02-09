export default {
  namespaced: true,
  state: {
    limit: 50,
    search: null,
    localGroups: [],
    workingGroups: [],
    timeCommitmentRange: [0, 40],
    selectedTimeCommitment: [0, 40],
    roleAmount: 0,
  },
  mutations: {
    update(state, { key, value }) {
      // console.log('[UPDATE]', key, value);
      if (key === 'localGroup' || key === 'workingGroup') {
        state[`${key}s`] = value;
      } else if (key === 'text') {
        state.search = `%${value}%`;
      } else if (key === 'timeCommitmentRange') {
        state.timeCommitmentRange = value;
      } else if (key === 'selectedTimeCommitment') {
        state.selectedTimeCommitment = value;
      } else if (key === 'reset') {
        state.limit = 50;
        state.search = null;
        state.localGroups = null;
        state.workingGroups = null;
        state.selectedTimeCommitment = [0, 40];
      } else {
        state[key] = value;
      }
      // console.log('[STATE]', state);
    }
  }
}
