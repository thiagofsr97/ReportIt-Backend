"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _check = require("express-validator/check");

var _moment = _interopRequireDefault(require("moment"));

var _users = require("../controllers/users");

var _jwtAuth = require("../helpers/jwtAuth");

var _filesManager = require("../helpers/filesManager");

/* GET users listing. */
var router = (0, _express.Router)();
var dateFormat = 'YYYY-MM-DD';
router.post('/login', [(0, _check.body)('username', 'Missing username parameter.').not().isEmpty(), (0, _check.body)('password', 'Missing password parameter.').not().isEmpty()], _users.authenticate);
router.get('/logout', _users.logout);
router.get('/', _users.getAll);
router.get('/:id', _users.getById);
router.put('/:id', _filesManager.uploadProfile.single('profile'), [(0, _check.body)('name', 'Body name parameter must be a string.').optional().isString(), (0, _check.body)('username', 'Body username parameter must be a string in lowercase.').optional().isString().isLowercase(), (0, _check.body)('password', 'Body password parameter must be a string.').optional().isString(), (0, _check.body)('dateBirth').optional().custom(function (dateBirth, _ref) {
  var req = _ref.req;
  var date = (0, _moment["default"])(dateBirth, dateFormat, true);

  if (!date.isValid()) {
    throw new Error('Parameter dateBirth is not follwing the format YYYY-MM-DD.');
  }

  req.body.dateBirth = date.toDate();
  return true;
}), (0, _check.body)('registrationNumber').optional().custom(function (registrationNumber) {
  var content;

  try {
    content = String(registrationNumber);
  } catch (err) {
    throw new Error('Parameter registrationNumber is not a string.');
  }

  var cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

  if (!content.match(cpfRegex)) {
    throw new Error('Param registrationNumber does not contain a valid CPF.');
  }

  return true;
})], _users.update);
router["delete"]('/:id', _users.exclude);
router.post('/register', _filesManager.uploadProfile.single('profile'), [(0, _check.body)('name', 'Missing name parameter.').not().isEmpty(), (0, _check.body)('password', 'Missing password parameter.').not().isEmpty(), (0, _check.body)('username').not().isEmpty().withMessage('Missing username parameter.').isLowercase().withMessage('Body username parameter must be in lowercase.'), (0, _check.body)('dateBirth').custom(function (dateBirth, _ref2) {
  var req = _ref2.req;

  if (dateBirth === undefined) {
    throw new Error('Missing dateBirth parameter.');
  }

  var date = (0, _moment["default"])(dateBirth, dateFormat, true);

  if (!date.isValid()) {
    throw new Error('Parameter dateBirth is not follwing the format YYYY-MM-DD.');
  }

  req.body.dateBirth = date.toDate();
  return true;
}), (0, _check.body)('registrationNumber').custom(function (registrationNumber) {
  if (registrationNumber === undefined) {
    throw new Error('Missing registrationNumber parameter.');
  }

  var content;

  try {
    content = String(registrationNumber);
  } catch (err) {
    throw new Error('Parameter registrationNumber is not a string.');
  }

  var cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;

  if (!content.match(cpfRegex)) {
    throw new Error('Param registrationNumber does not contain a valid CPF.');
  }

  return true;
})], _users.create);
router["delete"]('/', _users.deleteAll);
var _default = router;
exports["default"] = _default;