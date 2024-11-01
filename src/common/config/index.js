"use strict";
exports.__esModule = true;
exports.Config = void 0;
var dotenv = require("dotenv");
dotenv.config();
exports.Config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT),
    B2_APPLICATION_KEY_ID: process.env.B2_APPLICATION_KEY_ID,
    B2_APPLICATION_KEY: process.env.B2_APPLICATION_KEY,
    B2_ID: process.env.B2_ID
};
