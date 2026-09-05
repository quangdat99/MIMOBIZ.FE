import BaseAPI from '@/apis/base/baseapi.js';
import httpClient from '@/apis/base/httpClient.js';
class DossierAPI extends BaseAPI {
    controllerName = 'Dossiers';

    /**
     * Lấy hồ sơ đã sinh
     * @param {*} dossierId 
     */
    async getTimesheetByDossierID(dossierId) {
        let request = {
            url: [this.getAPIUrl(), 'Timesheet', dossierId].join('/'),
        };

        return httpClient.getAsync(request);
    }

    /**
     * Lấy tài liệu gốc đã sinh
     * @param {*} dossierId 
     */
    async getTaiLieuGocByDossierID(dossierId) {
        let request = {
            url: [this.getAPIUrl(), 'TaiLieuGoc', dossierId].join('/'),
        };

        return httpClient.getAsync(request);
    }

    /**
     * Cập nhật trạng thái closed
     * @param {*} dossierId 
     * @param {*} closed 
     */
    async updateClosed(dossierId, closed) {
        let request = {
            url: [this.getAPIUrl(), 'updateClosed', dossierId, closed].join('/'),
        };
        return httpClient.putAsync(request, true);
    }
}



export default new DossierAPI();