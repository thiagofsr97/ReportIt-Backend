"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAll = exports.logout = exports.exclude = exports.update = exports.create = exports.getById = exports.getAll = exports.authenticate = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _check = require("express-validator/check");

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _mongoose = require("mongoose");

var _jwtAuth = require("../helpers/jwtAuth");

var _user = _interopRequireDefault(require("../models/user"));

var authenticate =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res, next) {
    var validation, _req$body, username, password, result, user, match, payload, token;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            validation = (0, _check.validationResult)(req);

            if (validation.isEmpty()) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next((0, _httpErrors["default"])(422, validation.array())));

          case 3:
            _context.prev = 3;
            _req$body = req.body, username = _req$body.username, password = _req$body.password;
            result = {};
            _context.next = 8;
            return _user["default"].findOne({
              username: username
            });

          case 8:
            user = _context.sent;

            if (user) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", next((0, _httpErrors["default"])(404), 'User not found.'));

          case 11:
            _context.next = 13;
            return _bcrypt["default"].compare(password, user.password);

          case 13:
            match = _context.sent;

            if (!match) {
              _context.next = 25;
              break;
            }

            payload = {
              user: user.username,
              id: user._id
            };
            _context.next = 18;
            return (0, _jwtAuth.signIn)(payload);

          case 18:
            token = _context.sent;
            result.token = token;
            result.result = user;
            result.message = 'User has been successfully authenticated.';
            res.status(200).send(result);
            _context.next = 26;
            break;

          case 25:
            return _context.abrupt("return", next((0, _httpErrors["default"])(401, 'Authentication Error.')));

          case 26:
            _context.next = 31;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](3);
            next(_context.t0);

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 28]]);
  }));

  return function authenticate(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.authenticate = authenticate;

var getAll =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(req, res, next) {
    var result, users;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            result = {};
            _context2.next = 4;
            return _user["default"].find({
              deleted: false
            }).select('-password').exec();

          case 4:
            users = _context2.sent;

            if (!users) {
              _context2.next = 11;
              break;
            }

            result.result = users;
            result.message = 'Users have been successfully found.';
            res.status(200).send(result);
            _context2.next = 12;
            break;

          case 11:
            return _context2.abrupt("return", next((0, _httpErrors["default"])(404, 'There are not users in the DB.')));

          case 12:
            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 14]]);
  }));

  return function getAll(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getAll = getAll;

var getById =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(req, res, next) {
    var _id, result, user;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _id = req.params.id;
            result = {};
            _context3.next = 5;
            return _user["default"].findById(_id).select('-password').exec();

          case 5:
            user = _context3.sent;

            if (!user) {
              _context3.next = 11;
              break;
            }

            result.result = user;
            res.status(200).send(result);
            _context3.next = 12;
            break;

          case 11:
            return _context3.abrupt("return", next((0, _httpErrors["default"])(404, 'User not found.')));

          case 12:
            _context3.next = 19;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](0);

            if (!(_context3.t0 instanceof _mongoose.Error.CastError)) {
              _context3.next = 18;
              break;
            }

            return _context3.abrupt("return", next((0, _httpErrors["default"])(404, 'User not found \'cause id is not processable.')));

          case 18:
            next(_context3.t0);

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 14]]);
  }));

  return function getById(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getById = getById;

var create =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(req, res, next) {
    var validation, result, _req$body2, name, username, password, registrationNumber, dateBirth, user, userCreated;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            validation = (0, _check.validationResult)(req);

            if (validation.isEmpty()) {
              _context4.next = 3;
              break;
            }

            return _context4.abrupt("return", next((0, _httpErrors["default"])(422, validation.array())));

          case 3:
            _context4.prev = 3;
            result = {};
            _req$body2 = req.body, name = _req$body2.name, username = _req$body2.username, password = _req$body2.password, registrationNumber = _req$body2.registrationNumber, dateBirth = _req$body2.dateBirth;
            _context4.next = 8;
            return _user["default"].findOne({
              username: username
            });

          case 8:
            if (!_context4.sent) {
              _context4.next = 10;
              break;
            }

            return _context4.abrupt("return", next((0, _httpErrors["default"])(403, "Username ".concat(username, " has already been taken."))));

          case 10:
            user = new _user["default"]({
              name: name,
              username: username,
              password: password,
              dateBirth: dateBirth,
              registrationNumber: registrationNumber
            });

            if (req.file) {
              user.picture = {
                url: req.file.url,
                id: req.file.public_id,
                folder: req.file.destination
              };
            }

            _context4.next = 14;
            return user.save();

          case 14:
            userCreated = _context4.sent;
            result.result = userCreated;
            res.status(200).send(result);
            _context4.next = 22;
            break;

          case 19:
            _context4.prev = 19;
            _context4.t0 = _context4["catch"](3);
            next(_context4.t0);

          case 22:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[3, 19]]);
  }));

  return function create(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.create = create;

var update =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(req, res, next) {
    var validation, result, _id2, user, _req$body3, name, username, password, dateBirth, registrationNumber, exists, args, userSaved;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            validation = (0, _check.validationResult)(req);

            if (validation.isEmpty()) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt("return", next((0, _httpErrors["default"])(422, validation.array())));

          case 3:
            _context5.prev = 3;
            result = {};
            _id2 = req.params.id;
            _context5.next = 8;
            return _user["default"].findById(_id2);

          case 8:
            user = _context5.sent;

            if (user) {
              _context5.next = 11;
              break;
            }

            return _context5.abrupt("return", next((0, _httpErrors["default"])(404, 'User not found.')));

          case 11:
            _req$body3 = req.body, name = _req$body3.name, username = _req$body3.username, password = _req$body3.password, dateBirth = _req$body3.dateBirth, registrationNumber = _req$body3.registrationNumber;

            if (!username) {
              _context5.next = 18;
              break;
            }

            _context5.next = 15;
            return _user["default"].findOne({
              username: username
            });

          case 15:
            exists = _context5.sent;

            if (!(exists && exists._id !== _id2)) {
              _context5.next = 18;
              break;
            }

            return _context5.abrupt("return", next((0, _httpErrors["default"])(403, "Username ".concat(username, " has already been taken."))));

          case 18:
            args = (0, _objectSpread2["default"])({}, name && {
              name: name
            }, username && {
              username: username
            }, password && {
              password: password
            }, dateBirth && {
              dateBirth: dateBirth
            }, registrationNumber && {
              registrationNumber: registrationNumber
            });
            Object.assign(user, args);

            if (req.file) {
              user.picture = {
                url: req.file.url,
                id: req.file.public_id,
                folder: req.file.destination
              };
            }

            _context5.next = 23;
            return user.save();

          case 23:
            userSaved = _context5.sent;
            result.result = userSaved;
            result.message = 'User has been successfully updated.';
            res.status(200).send(result);
            _context5.next = 34;
            break;

          case 29:
            _context5.prev = 29;
            _context5.t0 = _context5["catch"](3);

            if (!(_context5.t0 instanceof _mongoose.Error.CastError)) {
              _context5.next = 33;
              break;
            }

            return _context5.abrupt("return", next((0, _httpErrors["default"])(404, 'User not updated \'cause id is not processable.')));

          case 33:
            next(_context5.t0);

          case 34:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 29]]);
  }));

  return function update(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.update = update;

var exclude =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6(req, res, next) {
    var result, _id3, userDeleted;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            result = {};
            _id3 = req.params.id;
            _context6.next = 5;
            return _user["default"].findByIdAndUpdate(_id3, {
              deleted: true
            });

          case 5:
            userDeleted = _context6.sent;
            result.result = userDeleted;
            result.message = 'User has been deleted sucessfully.';
            res.status(200).send(result);
            _context6.next = 14;
            break;

          case 11:
            _context6.prev = 11;
            _context6.t0 = _context6["catch"](0);
            next(_context6.t0);

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 11]]);
  }));

  return function exclude(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

exports.exclude = exclude;

var logout =
/*#__PURE__*/
function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee7(req, res, next) {
    var result, _id4;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            result = {};
            _id4 = req.params.id;
            _context7.next = 5;
            return (0, _jwtAuth.destroyJwt)(_id4);

          case 5:
            result.id = _id4;
            result.result = "User of id ".concat(_id4, " has succefully been logged out.");
            res.status(200).send(result);
            _context7.next = 13;
            break;

          case 10:
            _context7.prev = 10;
            _context7.t0 = _context7["catch"](0);
            return _context7.abrupt("return", next((0, _httpErrors["default"])(403, "Error logging out user of id ".concat(id, ". Might have already been logged out before or doesn't exit."))));

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 10]]);
  }));

  return function logout(_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();

exports.logout = logout;

var deleteAll =
/*#__PURE__*/
function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee8(req, res, next) {
    var result;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            result = {};
            _context8.next = 4;
            return _user["default"].deleteMany({});

          case 4:
            result.result = 'All users have been deleted from Database. Wow, you\'re crazy!';
            res.status(200).send(result);
            _context8.next = 11;
            break;

          case 8:
            _context8.prev = 8;
            _context8.t0 = _context8["catch"](0);
            next(_context8.t0);

          case 11:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 8]]);
  }));

  return function deleteAll(_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}();

exports.deleteAll = deleteAll;