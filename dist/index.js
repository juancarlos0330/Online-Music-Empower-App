"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./common/config");
const server_1 = require("./server");
new server_1.Server(config_1.Config.PORT).start();
//# sourceMappingURL=index.js.map