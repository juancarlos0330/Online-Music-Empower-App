"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderRoutes = void 0;
const default_1 = require("./default");
const home_1 = require("./home");
const renderRoutes = (app) => {
    app.use(home_1.default);
    app.use(default_1.default);
};
exports.renderRoutes = renderRoutes;
//# sourceMappingURL=index.js.map