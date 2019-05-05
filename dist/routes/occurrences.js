"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _check = require("express-validator/check");

var _moment = _interopRequireDefault(require("moment"));

var _jwtAuth = require("../helpers/jwtAuth");

var _filesManager = require("../helpers/filesManager");

var _occurrences = require("../controllers/occurrences");

var router = (0, _express.Router)();
var dateFormat = 'YYYY-MM-DD';
router.post('/create', _filesManager.upload.fields([{
  name: 'itemsPics',
  maxCount: 5
}, {
  name: 'locationPics',
  maxCount: 5
}]), [(0, _check.body)('id', 'Missing id parameter.').not().isEmpty(), (0, _check.body)('description', 'Missing description parameter. Parameter must be a string.').not().isEmpty().isString(), (0, _check.body)('date').custom(function (date, _ref) {
  var req = _ref.req;

  if (date === undefined) {
    throw new Error('Missing date parameter.');
  }

  var parser = (0, _moment["default"])(date, dateFormat, true);

  if (!parser.isValid()) {
    throw new Error('Body date parameter is not following the format YYYY-MM-DD');
  }

  req.body.date = parser.toDate();
  return true;
}), (0, _check.body)('type', 'The type parameter must be assault or robbery.').matches(/^assault$|^robbery$/), (0, _check.body)('location').custom(function (location, _ref2) {
  var req = _ref2.req;

  if (!location) {
    throw new Error('Missing location parameter');
  }

  var json = {};

  try {
    json = JSON.parse(location);
  } catch (err) {
    throw new Error('Location parameter must be a json with fields lat and lng, containing numeric values.');
  }

  if (!json.lat || !json.lng) {
    throw new Error('Location parameter must be a json with fields lat and lng, containing numeric values.');
  }

  if (!json.lat && Number.isNaN(json.lat)) {
    throw new Error('The field lat in location is not numeric.');
  }

  if (json.lng && Number.isNaN(json.lng)) {
    throw new Error('The field lng in location is not numeric.');
  }

  req.body.location = {
    type: 'Point',
    coordinates: [json.lat, json.lng]
  };
  return true;
}), (0, _check.body)('itemsLost', 'Missing itemsLost parameter. Parameter must be an array.').not().isEmpty().isArray()], _occurrences.create);
router.get('/', [(0, _check.query)('radius', 'Query radius parameter must be numeric.').optional().isNumeric(), (0, _check.query)('type').optional().matches(/^assault$|^robbery$/), (0, _check.query)('date_start').optional().custom(function (date, _ref3) {
  var req = _ref3.req;
  var start = (0, _moment["default"])(date, dateFormat, true);

  if (!start.isValid()) {
    throw new Error('Query date_start parameter is not following the format YYYY-MM-DD.');
  }

  req.query.date_start = start.toDate();
  return true;
}), (0, _check.query)('date_end').optional().custom(function (date, _ref4) {
  var req = _ref4.req;
  var end = (0, _moment["default"])(date, dateFormat, true);

  if (!end.isValid()) {
    throw new Error('Query date_end parameter is not following the format YYYY-MM-DD.');
  }

  req.query.date_end = end.toDate();
  return true;
}), (0, _check.query)('long', 'Query long parameter must be numeric.').optional().isNumeric(), (0, _check.query)('latt', 'Query latt parameter must be numeric.').optional().isNumeric()], _occurrences.getAll);
router.get('/:id', _occurrences.getById);
router.get('/user/:id', _occurrences.getByUserId);
router.put('/:id', [(0, _check.body)('description', 'Body description parameter must be a string.').optional().isString(), (0, _check.body)('date').optional().custom(function (newDate, _ref5) {
  var req = _ref5.req;
  var date = (0, _moment["default"])(newDate, dateFormat, true);

  if (!date.isValid()) {
    throw new Error('Body date parameter is not following the format YYYY-MM-DD.');
  }

  req.body.date = date.toDate();
  return true;
}), (0, _check.body)('type', 'The type parameter must be assault or robbery.').optional().matches(/^assault$|^robbery$/), (0, _check.body)('location').optional().custom(function (location, _ref6) {
  var req = _ref6.req;
  var json = {};

  try {
    json = JSON.parse(location);
  } catch (err) {
    throw new Error('Location parameter must be a json with fields lat and lng, containing numeric values.');
  }

  if (!json.lat || !json.lng) {
    throw new Error('Location parameter must be a json with fields lat and lng, containing numeric values.');
  }

  if (json.lat && Number.isNaN(json.lat)) {
    throw new Error('The field lat in location is not numeric.');
  }

  if (json.lng && Number.isNaN(json.lng)) {
    throw new Error('The field lng in location is not numeric.');
  }

  req.body.location = {
    type: 'Point',
    coordinates: [json.lat, json.lng]
  };
  return true;
}), (0, _check.body)('itemsLost', 'Body itemsLost parameter must be an array.').optional().isArray()], _occurrences.update);
var _default = router;
exports["default"] = _default;