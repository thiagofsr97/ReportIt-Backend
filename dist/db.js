"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

_mongoose["default"].set('useCreateIndex', true);

_mongoose["default"].set('useFindAndModify', false);

var uri = "mongodb://".concat(process.env.DB_HOST, ":").concat(process.env.DB_PORT, "/").concat(process.env.DB_NAME);

var db = function dbConnection() {
  return _mongoose["default"].connect(uri, {
    useNewUrlParser: true
  });
};

var _default = db;
exports["default"] = _default;