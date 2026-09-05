import state from './moduleContextState.js';
import mutations from './moduleContextMutations.js';
import actions from './moduleContextActions.js';
import getters from './moduleContextGetters.js';

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}