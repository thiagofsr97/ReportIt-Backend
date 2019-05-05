"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getByUserId = exports.getById = exports.update = exports.exclude = exports.getAll = exports.create = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _check = require("express-validator/check");

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _mongoose = require("mongoose");

var _occurrence = _interopRequireDefault(require("../models/occurrence"));

var create =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res, next) {
    var validation, _req$body, description, date, type, location, itemsLost, id, occurrence, assigned, _req$files, itemsPics, locationPics, occurenceSaved, result;

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
            _req$body = req.body, description = _req$body.description, date = _req$body.date, type = _req$body.type, location = _req$body.location, itemsLost = _req$body.itemsLost, id = _req$body.id;
            occurrence = new _occurrence["default"]({
              description: description,
              date: date,
              type: type,
              itemsLost: itemsLost,
              location: location,
              createdBy: id
            });

            if (req.files) {
              assigned = false;
              _req$files = req.files, itemsPics = _req$files.itemsPics, locationPics = _req$files.locationPics;

              if (itemsPics) {
                occurrence.itemsPics = [];
                itemsPics.forEach(function (picture) {
                  var url = picture.url,
                      secure_url = picture.secure_url,
                      public_id = picture.public_id;

                  if (!assigned) {
                    occurrence.folder = picture.destination;
                    assigned = true;
                  }

                  occurrence.itemsPics.push({
                    url: url,
                    secureUrl: secure_url,
                    id: public_id
                  });
                });
              }

              if (locationPics) {
                occurrence.locationPics = [];
                locationPics.forEach(function (picture) {
                  var url = picture.url,
                      secure_url = picture.secure_url,
                      public_id = picture.public_id;

                  if (!assigned) {
                    occurrence.folder = picture.destination;
                    assigned = true;
                  }

                  occurrence.locationPics.push({
                    url: url,
                    secureUrl: secure_url,
                    id: public_id
                  });
                });
              }
            }

            _context.next = 9;
            return occurrence.save();

          case 9:
            occurenceSaved = _context.sent;
            result = {};
            result.result = occurenceSaved;
            res.status(200).send(result);
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](3);
            next(_context.t0);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 15]]);
  }));

  return function create(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.create = create;

var getById =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(req, res, next) {
    var result, id, occurrence;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            result = {};
            id = req.params.id;
            _context2.next = 5;
            return _occurrence["default"].findById(id).select('-deleted').exec();

          case 5:
            occurrence = _context2.sent;

            if (!occurrence) {
              _context2.next = 11;
              break;
            }

            result.result = occurrence;
            result.message = 'Occurrence has been successfully found.';
            _context2.next = 12;
            break;

          case 11:
            return _context2.abrupt("return", next((0, _httpErrors["default"])(404, 'Occurrence not found.')));

          case 12:
            res.status(200).send(result);
            _context2.next = 20;
            break;

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](0);

            if (!(_context2.t0 instanceof _mongoose.Error.CastError)) {
              _context2.next = 19;
              break;
            }

            return _context2.abrupt("return", next((0, _httpErrors["default"])(404, 'Occurrence couldn\'t be found \'cause id is not processable.')));

          case 19:
            next(_context2.t0);

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 15]]);
  }));

  return function getById(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getById = getById;

var getByUserId =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(req, res, next) {
    var id, occurrences, result;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            id = req.params.id;
            _context3.next = 4;
            return _occurrence["default"].find({
              createdBy: id,
              deleted: false
            }).select('-deleted').exec();

          case 4:
            occurrences = _context3.sent;

            if (occurrences) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", next((0, _httpErrors["default"])(404, 'Occurrences not found.')));

          case 7:
            result = {};
            result.result = occurrences;
            result.message = 'Occurrences have been sucessfully found.';
            res.status(200).send(result);
            _context3.next = 16;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 13]]);
  }));

  return function getByUserId(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getByUserId = getByUserId;

var getAll =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(req, res, next) {
    var validation, _req$query, date_start, date_end, radius, type, _long, latt, dateQuery, start, end, query, result, occurences;

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
            _req$query = req.query, date_start = _req$query.date_start, date_end = _req$query.date_end, radius = _req$query.radius, type = _req$query.type, _long = _req$query["long"], latt = _req$query.latt;

            if (date_start) {
              start = date_start;
              end = start.clone();

              if (date_end) {
                end = date_end;
              }

              end.add(1, 'days');
              dateQuery = {
                date: {
                  $gte: start,
                  $lte: end
                }
              };
            }

            query = (0, _objectSpread2["default"])({}, radius && _long && latt && {
              location: {
                $near: {
                  $maxDistance: radius,
                  $geometry: {
                    type: 'Point',
                    coordinates: [_long, latt]
                  }
                }
              }
            }, type && {
              type: type
            }, dateQuery && {
              dateQuery: dateQuery
            }, {
              deleted: false
            });
            result = {};
            _context4.next = 10;
            return _occurrence["default"].find(query).select('-deleted').exec();

          case 10:
            occurences = _context4.sent;

            if (!occurences) {
              _context4.next = 16;
              break;
            }

            result.result = occurences;
            res.status(200).send(result);
            _context4.next = 17;
            break;

          case 16:
            return _context4.abrupt("return", next((0, _httpErrors["default"])(404, 'No occurrences have been found.')));

          case 17:
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

  return function getAll(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getAll = getAll;

var exclude =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(req, res, next) {
    var validation, result, id, occurrenceDeleted;
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
            id = req.params.id.id;
            _context5.next = 8;
            return _occurrence["default"].findByIdAndUpdate(id, {
              deleted: true
            });

          case 8:
            occurrenceDeleted = _context5.sent;
            result.result = occurrenceDeleted;
            result.message = 'Occurence succefully excluded.';
            _context5.next = 18;
            break;

          case 13:
            _context5.prev = 13;
            _context5.t0 = _context5["catch"](3);

            if (!(_context5.t0 instanceof _mongoose.Error.CastError)) {
              _context5.next = 17;
              break;
            }

            return _context5.abrupt("return", next((0, _httpErrors["default"])(404, 'Occurrence couldn\'t be deleted \' cause has not been found.')));

          case 17:
            next(_context5.t0);

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 13]]);
  }));

  return function exclude(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.exclude = exclude;

var update =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6(req, res, next) {
    var validation, result, id, occurrence, _req$body2, description, date, type, location, itemsLost, args, _req$files2, itemsPics, locationPics, assigned, occurrenceSaved;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            validation = (0, _check.validationResult)(req);

            if (validation.isEmpty()) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt("return", next((0, _httpErrors["default"])(422, validation.array())));

          case 3:
            _context6.prev = 3;
            result = {};
            id = req.params.id;
            _context6.next = 8;
            return _occurrence["default"].findById(id);

          case 8:
            occurrence = _context6.sent;

            if (occurrence) {
              _context6.next = 11;
              break;
            }

            return _context6.abrupt("return", next((0, _httpErrors["default"])(404, 'Occurrence not updated \'cause was not found with this id.')));

          case 11:
            _req$body2 = req.body, description = _req$body2.description, date = _req$body2.date, type = _req$body2.type, location = _req$body2.location, itemsLost = _req$body2.itemsLost;
            args = (0, _objectSpread2["default"])({}, description && {
              description: description
            }, date && {
              date: date
            }, type && {
              type: type
            }, location && {
              location: location
            }, itemsLost && {
              itemsLost: itemsLost
            });
            Object.assign(occurrence, args);

            if (req.files) {
              _req$files2 = req.files, itemsPics = _req$files2.itemsPics, locationPics = _req$files2.locationPics;
              assigned = false;

              if (itemsPics) {
                occurrence.itemsPics = [];
                itemsPics.forEach(function (picture) {
                  var url = picture.url,
                      secure_url = picture.secure_url,
                      public_id = picture.public_id;

                  if (!assigned) {
                    occurrence.folder = picture.destination;
                    assigned = true;
                  }

                  occurrence.itemsPics.push({
                    url: url,
                    secureUrl: secure_url,
                    id: public_id
                  });
                });
              }

              if (locationPics) {
                occurrence.locationPics = [];
                locationPics.forEach(function (picture) {
                  var url = picture.url,
                      secure_url = picture.secure_url,
                      public_id = picture.public_id;

                  if (!assigned) {
                    occurrence.folder = picture.destination;
                    assigned = true;
                  }

                  occurrence.locationPics.push({
                    url: url,
                    secureUrl: secure_url,
                    id: public_id
                  });
                });
              }
            }

            _context6.next = 17;
            return occurrence.save();

          case 17:
            occurrenceSaved = _context6.sent;
            result.result = occurrenceSaved;
            result.message = 'Occurrence has been succefully updated.';
            res.status(200).send(result);
            _context6.next = 28;
            break;

          case 23:
            _context6.prev = 23;
            _context6.t0 = _context6["catch"](3);

            if (!(_context6.t0 instanceof _mongoose.Error.CastError)) {
              _context6.next = 27;
              break;
            }

            return _context6.abrupt("return", next((0, _httpErrors["default"])(404, 'Occurrence couldn\'t be updated\' cause id is not processable.')));

          case 27:
            next(_context6.t0);

          case 28:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[3, 23]]);
  }));

  return function update(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

exports.update = update;