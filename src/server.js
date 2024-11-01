"use strict";
exports.__esModule = true;
exports.Server = void 0;
var express = require("express");
var compression = require("compression");
var cors = require("cors");
var http = require("http");
var routes_1 = require("./routes");
var Server = /** @class */ (function () {
    function Server(port) {
        this._port = port;
        this._app = express();
        this._server = http.createServer(this._app);
    }
    Server.prototype.start = function () {
        this._initializeMiddlewares();
        this._initializeErrorHandler();
        this._run();
    };
    Server.prototype._initializeMiddlewares = function () {
        this._app.use(express.json({ limit: '50mb' }));
        this._app.use(express.urlencoded({ extended: true }));
        this._app.use(cors());
        this._app.use(compression());
        this._app.set('view engine', 'ejs');
        this._app.use(express.static('public'));
        (0, routes_1.renderRoutes)(this._app);
    };
    Server.prototype._initializeErrorHandler = function () {
        this._app.use(function (error, req, res, next) {
            console.error(error);
            return res.status(500).send('An unknown error occurred. Please try again later!');
        });
    };
    Server.prototype._run = function () {
        var _this = this;
        this._server.listen(this._port, function () {
            console.log("Server is running on port ".concat(_this._port));
        });
    };
    return Server;
}());
exports.Server = Server;
