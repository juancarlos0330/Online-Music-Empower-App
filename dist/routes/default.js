"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get('*', (req, res) => {
    res.redirect('/');
});
router.all('*', (req, res) => {
    res.status(404).end();
});
exports.default = router;
//# sourceMappingURL=default.js.map