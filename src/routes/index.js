"use strict";
exports.__esModule = true;
exports.renderRoutes = void 0;
var default_1 = require("./default");
var home_1 = require("./home");
var renderRoutes = function (app) {
    app.use(home_1["default"]);
    app.use(default_1["default"]);
};
exports.renderRoutes = renderRoutes;
