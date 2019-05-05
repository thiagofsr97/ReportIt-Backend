"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.destroyJwt = exports.signIn = exports.validateToken = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ioredis = _interopRequireDefault(require("ioredis"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _jwtRedis = _interopRequireDefault(require("jwt-redis"));

var _enviroment = _interopRequireDefault(require("../config/enviroments/enviroment"));

// import jwt from 'jsonwebtoken';
var redis = new _ioredis["default"]();
var jwt = new _jwtRedis["default"](redis);
var SECRET = "".concat(_enviroment["default"].SECRET);
var options = {
  expiresIn: '1d'
};

var validateToken =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res, next) {
    var authorizationHeaader, result, token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            authorizationHeaader = req.headers.authorization;

            if (!authorizationHeaader) {
              _context.next = 18;
              break;
            }

            token = req.headers.authorization.split(' ')[1]; // Bearer <token>

            _context.prev = 3;
            _context.next = 6;
            return jwt.verify(token, SECRET, options);

          case 6:
            result = _context.sent;
            // Let's pass back the decoded token to the request object
            req.decoded = result; // We call next to pass execution to the subsequent middleware

            next();
            _context.next = 16;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](3);

            if (!(_context.t0 instanceof _jwtRedis["default"].JsonWebTokenError || _context.t0 instanceof _jwtRedis["default"].TokenExpiredError)) {
              _context.next = 15;
              break;
            }

            return _context.abrupt("return", next((0, _httpErrors["default"])(401, ' Authentication error. Token is invalid.')));

          case 15:
            return _context.abrupt("return", next(_context.t0));

          case 16:
            _context.next = 19;
            break;

          case 18:
            return _context.abrupt("return", next((0, _httpErrors["default"])(401, 'Authentication error. Token required.')));

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 11]]);
  }));

  return function validateToken(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.validateToken = validateToken;

var destroyJwt =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(id) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return jwt.destroyById(id, options);

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function destroyJwt(_x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.destroyJwt = destroyJwt;

var signIn =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(payload) {
    var token;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return jwt.sign(payload, SECRET, options);

          case 2:
            token = _context3.sent;
            return _context3.abrupt("return", token);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function signIn(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

exports.signIn = signIn;