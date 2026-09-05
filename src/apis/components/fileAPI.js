import BaseAPI from '@/apis/base/baseapi.js';
import httpClient, {
    FormMultiPart,
    FormUrlEncoded,
    ApplicationJson,
    POST,
    PUT,
    GET,
    DELETE
} from '@/apis/base/httpClient.js';
class FileAPI extends BaseAPI {
    controllerName = 'FileApi';

    async upload(fileName, formData) {
        let request = {
            url: [this.getAPIUrl(), 'Upload', fileName].join('/'),
            data: formData
        };
        return httpClient.postAsync(request, true);
    }
}

export default new FileAPI();