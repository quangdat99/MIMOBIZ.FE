import {
  createStore
} from 'vuex'
import createPersistedState from "vuex-persistedstate";
import state from './state.js';
import getters from './getters.js';
import mutations from './mutations.js';
import actions from './actions.js';

import moduleContext from './context/moduleContext.js';

// Create a new store instance.
const store = createStore({
  state,
  mutations,
  actions,
  getters,
  modules: {
    moduleContext,
  },
  strict: true,
  plugins: [createPersistedState()]
})

export default store;