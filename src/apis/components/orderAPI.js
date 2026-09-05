import BaseAPI from '@/apis/base/baseapi.js'
import Http from '@/apis/base/httpConfig.js'
import commonF from '@/commons/commonFunction.js';

class OrderAPI extends BaseAPI {
    controllerName = 'Orders';
}

export default new OrderAPI();