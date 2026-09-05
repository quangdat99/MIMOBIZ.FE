import Http from '@/apis/base/httpConfig.js';
import BaseAPI from '@/apis/base/baseapi.js';
// import Http from '@/apis/base/httpConfig.js'
class checkerAPI extends BaseAPI {
    controllerName = 'Checkers';

    async login(model){
        let res = await Http.axios().post(`${this.controllerName}/login`, model);
        return res;
    }
    async token(){
        let res = await Http.axios().get(`${this.controllerName}/token`);
        return res;
    }
}

export default new checkerAPI();