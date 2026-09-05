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
    User(state) {
        return state.Context;
    },
    Tenant(state) {
        return {
            tenant_id: state.Context?.tenant_id,
            tenant_code: state.Context?.tenant_code,
            tenant_name: state.Context?.tenant_name
        };
    },
    Tenants(state) {
        return state.Context?.tenants || [];
    },
    IsSuperAdmin(state) {
        return state.Context?.is_super_admin === true || state.Context?.role === 1 || state.Context?.role_detail === 'SuperAdmin' || state.Context?.roleDetail === 'SuperAdmin';
    },
    RoleDetails(state) {
        if (!state.Context?.roleDetail) return [];
        try {
            const parsed = typeof state.Context.roleDetail === 'string'
                ? JSON.parse(state.Context.roleDetail)
                : state.Context.roleDetail;
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    },
}