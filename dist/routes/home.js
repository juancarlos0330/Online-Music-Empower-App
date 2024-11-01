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
const express = require("express");
const b2_service_1 = require("../services/b2.service");
const router = express.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const b2Data = yield new b2_service_1.B2Service().getData();
    res.render('home', {
        categories: b2Data.categories,
        categoriesBase64: Buffer.from(JSON.stringify(b2Data.categories)).toString('base64'),
        stock: b2Data.stock
    });
}));
exports.default = router;
//# sourceMappingURL=home.js.map