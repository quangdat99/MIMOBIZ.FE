export default {
    Token(state) {
        return state.Token;
    },
    Checker(state) {
        return state.Checker;
    },
    Context(state) {
        return state.Context;
    },
    RoleDetails(state) {
        return JSON.parse(state.Context?.roleDetail || '[]');
    },
}