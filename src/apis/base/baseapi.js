import Http from '@/apis/base/httpConfig.js';
import APIConfig from '@/apis/config/apiconfig.js';
import store from '@/store/store.js';
import commonF from '@/commons/commonFunction.js';
import httpClient, {
    FormMultiPart,
    FormUrlEncoded,
    ApplicationJson,
    POST,
    PUT,
    GET,
    DELETE
} from '@/apis/base/httpClient.js';

export default class BaseApi {
    controllerName = '';
    baseUrl = '';

    initAPI() {
        this.baseUrl = APIConfig + '/' + this.controllerName;
    }

    getAPIUrl() {
        if (this.baseUrl == '') {
            this.initAPI();
        }
        return this.baseUrl;
    }

    /**
     * Cập nhật
     */
    update(payload) {
        let request = {
            url: this.getAPIUrl(),
            data: payload
        };
        return httpClient.putAsync(request, true);
    }
    /**
     * Xóa
     */
    delete(payload) {
        let request = {
            url: this.getAPIUrl(),
            data: payload
        };
        return httpClient.deleteAsync(request, true);
    }

    /**
     * Lấy bản ghi mặc định khi thêm mới
     */
    getNew(payload) {
        let request = {
            url: this.getAPIUrl() + '/new',
            data: payload
        };

        return httpClient.getAsync(request);
    }

    /**
     * Lấy bản ghi mặc định khi thêm mới
     */
    getEdit(payload) {
        let request = {
            url: [this.getAPIUrl(), payload.id].join('/')
        };

        return httpClient.getAsync(request);
    }

    /**
     * Lấy bản ghi mặc định khi nhân bản
     */
    getDuplicate(payload) {
        let request = {
            url: [this.getAPIUrl(), 'duplicate', payload.id].join('/')
        };

        return httpClient.getAsync(request);
    }

    /**
     * Thêm mới
     */
    insert(payload) {
        let request = {
            url: this.getAPIUrl(),
            data: payload
        };
        return httpClient.postAsync(request, true);
    }

    /**
     * Lấy dữ liệu combobox load paging
     */
    async getComboboxPaging(payload) {
        let param = { ...payload };
        if (param.filter) {
            param.filter = JSON.stringify(param.filter);
        }
        let request = {
            url: [this.getAPIUrl(), 'combobox'].join('/'),
            data: param
        };
        return httpClient.postAsync(request, true);
    }

    /**
     * Lấy dữ liệu bảng
     */
    async getDataTable(payload) {
        let request = {
            url: [this.getAPIUrl(), 'dataTable'].join('/'),
            data: payload
        };
        return httpClient.postAsync(request, true);
    }

    /**
     * Lưu dữ liệu
     */
    async saveData(payload, mode) {
        let request = {
            url: [this.getAPIUrl(), 'saveData', mode].join('/'),
            data: payload
        };
        return httpClient.postAsync(request, true);
    }


    /**
     * Xuất khẩu
     */
    async exportExcel(payload) {
        let request = {
            url: [this.getAPIUrl(), 'Export'].join('/'),
            data: payload
        };
        return httpClient.postAsync(request, true);
    }
}