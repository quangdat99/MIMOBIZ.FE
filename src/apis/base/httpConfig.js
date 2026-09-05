import APIConfig from '@/apis/config/apiconfig.js';
import axios from "axios";
import store from '@/store/store.js';

class Http {
    axios() {
        let headers = {};
        headers['Content-Type'] = 'application/json';
        const context = store.state['moduleContext'];
        if (context && context.Token) {
            headers['Authorization'] = context.Token;
            const tenant = context.Context?.tenant_code || context.Context?.tenant_id;
            if (tenant) {
                headers['X-Tenant-Id'] = tenant;
            }
        }
        return axios.create({
            baseURL: APIConfig,
            headers: headers
        });
    }
}

export default new Http();
