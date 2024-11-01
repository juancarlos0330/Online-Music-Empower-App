"use strict";
exports.__esModule = true;
var express = require("express");
var router = express.Router();
router.get('*', function (req, res) {
    res.redirect('/');
});
router.all('*', function (req, res) {
    res.status(404).end();
});
exports["default"] = router;
