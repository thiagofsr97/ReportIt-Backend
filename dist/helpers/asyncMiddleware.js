"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var asyncMiddleware = function asyncMiddleware(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next));
  };
};

var _default = asyncMiddleware;
exports["default"] = _default;