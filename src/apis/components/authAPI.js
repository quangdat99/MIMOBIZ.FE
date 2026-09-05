import Http from '@/apis/base/httpConfig.js';
import BaseAPI from '@/apis/base/baseapi.js';

class AuthAPI extends BaseAPI {
    controllerName = 'Auth';

    /**
     * Đăng nhập hệ thống qua AuthController tại BE
     * @param {Object} model { account, password }
     */
    async login(model) {
        let res = await Http.axios().post(`${this.controllerName}/login`, model);
        return res;
    }
}

export default new AuthAPI();
