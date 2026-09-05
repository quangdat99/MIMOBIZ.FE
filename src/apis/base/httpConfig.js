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
        }
        return axios.create({
            baseURL: APIConfig,
            headers: headers
        });
    }
}

export default new Http();
