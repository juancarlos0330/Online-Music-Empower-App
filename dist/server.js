"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express = require("express");
const compression = require("compression");
const cors = require("cors");
const http = require("http");
const routes_1 = require("./routes");
class Server {
  constructor(port) {
    this._port = port;
    this._app = express();
    this._server = http.createServer(this._app);
  }
  start() {
    this._initializeMiddlewares();
    this._initializeErrorHandler();
    this._run();
  }
  _initializeMiddlewares() {
    this._app.use(express.json({ limit: "50mb" }));
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(cors());
    this._app.use(compression());
    this._app.set("view engine", "ejs");
    this._app.use(express.static("public"));
    (0, routes_1.renderRoutes)(this._app);
  }
  _initializeErrorHandler() {
    this._app.use((error, req, res, next) => {
      console.error(error);
      return res
        .status(500)
        .send("An unknown error occurred. Please try again later!");
    });
  }
  _run() {
    this._server.listen(this._port, () => {
      console.log(`Server is running on port ${this._port}`);
    });
  }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map
