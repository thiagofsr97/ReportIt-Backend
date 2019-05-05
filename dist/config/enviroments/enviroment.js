"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _path = _interopRequireDefault(require("path"));

var env = function enviroment() {
  var environmentType = /^dev$|^production$/;

  if (environmentType.test(process.env.NODE_ENV)) {
    return _path["default"].join(__dirname, ".env.".concat(process.env.NODE_ENV));
  }

  return _path["default"].join(__dirname, '.env.production');
};

var envVariables = _dotenv["default"].config({
  path: env()
});

var _default = envVariables.parsed;
exports["default"] = _default;