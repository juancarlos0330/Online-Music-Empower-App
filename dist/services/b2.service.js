"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.B2Service = void 0;
const B2 = require("backblaze-b2");
const config_1 = require("../common/config");
class B2Service {
    constructor() {
        this._client = new B2({
            applicationKeyId: config_1.Config.B2_APPLICATION_KEY_ID,
            applicationKey: config_1.Config.B2_APPLICATION_KEY
        });
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const authResponse = yield this._client.authorize();
            let stock = '';
            const categories = {};
            let response = yield this._client.listFileNames({ bucketId: config_1.Config.B2_ID, startFileName: '', delimiter: '', prefix: '', maxFileCount: 10000 });
            while (true) {
                for (const file of response.data.files.slice(1)) {
                    if (!file.fileName.includes('.mp3'))
                        continue;
                    if (file.fileName.includes('stock files')) {
                        stock = `${authResponse.data.s3ApiUrl}/empower-hour/${file.fileName}`;
                    }
                    else if (file.fileName.includes('categories/')) {
                        const category = file.fileName.split('/')[1];
                        if (!categories[category]) {
                            categories[category] = [];
                        }
                        categories[category].push(`${authResponse.data.s3ApiUrl}/empower-hour/${file.fileName}`);
                    }
                }
                response = yield this._client.listFileNames({ bucketId: config_1.Config.B2_ID, startFileName: response.data.files[response.data.files.length - 1].fileName, delimiter: '', prefix: '', maxFileCount: 10000 });
                if (response.data.files.length === 1) {
                    break;
                }
            }
            return {
                categories,
                stock
            };
        });
    }
}
exports.B2Service = B2Service;
//# sourceMappingURL=b2.service.js.map