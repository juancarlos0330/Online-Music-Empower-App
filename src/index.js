"use strict";
exports.__esModule = true;
var config_1 = require("./common/config");
var server_1 = require("./server");
new server_1.Server(config_1.Config.PORT).start();
