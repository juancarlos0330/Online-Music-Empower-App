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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.B2Service = void 0;
//@ts-ignore
var B2 = require("backblaze-b2");
var config_1 = require("../common/config");
var B2Service = /** @class */ (function () {
    function B2Service() {
        this._client = new B2({
            applicationKeyId: config_1.Config.B2_APPLICATION_KEY_ID,
            applicationKey: config_1.Config.B2_APPLICATION_KEY
        });
    }
    B2Service.prototype.getData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authResponse, stock, categories, response, _i, _a, file, category;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._client.authorize()];
                    case 1:
                        authResponse = _b.sent();
                        stock = '';
                        categories = {};
                        return [4 /*yield*/, this._client.listFileNames({ bucketId: config_1.Config.B2_ID, startFileName: '', delimiter: '', prefix: '', maxFileCount: 10000 })];
                    case 2:
                        response = _b.sent();
                        _b.label = 3;
                    case 3:
                        if (!true) return [3 /*break*/, 5];
                        for (_i = 0, _a = response.data.files.slice(1); _i < _a.length; _i++) {
                            file = _a[_i];
                            if (!file.fileName.includes('.mp3'))
                                continue;
                            if (file.fileName.includes('stock files')) {
                                stock = "".concat(authResponse.data.s3ApiUrl, "/empower-hour/").concat(file.fileName);
                            }
                            else if (file.fileName.includes('categories/')) {
                                category = file.fileName.split('/')[1];
                                if (!categories[category]) {
                                    categories[category] = [];
                                }
                                categories[category].push("".concat(authResponse.data.s3ApiUrl, "/empower-hour/").concat(file.fileName));
                            }
                        }
                        return [4 /*yield*/, this._client.listFileNames({ bucketId: config_1.Config.B2_ID, startFileName: response.data.files[response.data.files.length - 1].fileName, delimiter: '', prefix: '', maxFileCount: 10000 })];
                    case 4:
                        response = _b.sent();
                        if (response.data.files.length === 1) {
                            return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 3];
                    case 5: return [2 /*return*/, {
                            categories: categories,
                            stock: stock
                        }];
                }
            });
        });
    };
    return B2Service;
}());
exports.B2Service = B2Service;
