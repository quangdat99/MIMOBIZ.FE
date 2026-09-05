export default {
    updateToken(state, payload){
        state.Token = payload.Token;
        state.Checker = payload.Checker;
        state.Context = payload.Context;
    },
    updateLogout(state){
        state.Token = null;
        state.Checker = null;
        state.Context = null;

        // Xóa tất cả storage
        sessionStorage.clear();
        localStorage.clear();
    },
    updateLoading(state, payload){
        state.Loading = payload;
    },
    updatePath(state, path){
        state.Path = path;
    },
    updateTo(state, to){
        state.To = to;
    }
}