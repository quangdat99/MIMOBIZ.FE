import api from '@/apis/components/timesheetAPI.js';
import Crud from '../crudBase.js';

var crud = new Crud('timesheet', api);

const state = {
  ...crud.state,
  _config: {
    field: {
      key: 'id',
      code: 'code',
    }
  }
};
const getters = {
  ...crud.getters,
};
const actions = {
  ...crud.actions,
};
const mutations = {
  ...crud.mutations,
};

export default {
  state,
  mutations,
  actions,
  getters,
  namespaced: true,
}