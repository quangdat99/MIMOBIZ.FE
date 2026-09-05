export default class {
  constructor(name, api) {
    const me = this;
    /**
     * state
     */
    me.state = {
      /**
       * Loading
       */
      loading: false,
      /**
       * Tổng bản ghi theo paging
       */
      total: 0,
      /**
       * Không có dữ liệu trong bảng
       * Dùng cờ này để hiển thị màn hình trống trên danh sách
       */
      empty: false,
      /**
       * Data
       */
      items: [],
    };

    me.actions = {
      getController() {
        return api.getAPIUrl();
      },
      updateAccount(context, payload) {
        context.commit("updateAccount", payload);
      },
      updateToken(context, payload) {
        context.commit("updateToken", payload);
      },
      updateIsLoading(context, payload) {
        context.commit("updateIsLoading", payload);
      }
    };

    me.mutations = {
      updateAccount(state, payload) {
        if (payload != null && typeof payload == 'object') {
          if (state.account == null) {
            state.account = {};
          }
          for (const [key, value] of Object.entries(payload)) {
            state.account[key] = value;
          }
        }
      },
      updateToken(state, payload) {
        if (payload && typeof payload === 'object') {
          state.token = payload.token;
        }
      },
      updateIsLoading(state, payload) {
        if (payload) {
          state.isLoading = payload.loading;
        }
      }
    };
    me.getters = {
    }
  }
}