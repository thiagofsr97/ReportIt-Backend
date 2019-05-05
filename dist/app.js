"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _helmet = _interopRequireDefault(require("helmet"));

var _enviroment = _interopRequireDefault(require("./config/enviroments/enviroment"));

var _users = _interopRequireDefault(require("./routes/users"));

var _occurrences = _interopRequireDefault(require("./routes/occurrences"));

/**
 *
 * Author: Thiago Filipe Soares da Rocha
 * Email: thiago.filipe@lavid.ufpb.br
 *
 */

/**
  * Module dependenciess
  */
var app = (0, _express["default"])();
app.use((0, _helmet["default"])());
app.use((0, _cors["default"])());
app.use((0, _morgan["default"])("".concat(_enviroment["default"].LOGGER_FORMAT)));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use((0, _cookieParser["default"])());
/**
 * Setting up routes
 */

app.use('/users', _users["default"]);
app.use('/occurrences', _occurrences["default"]);
/**
  * Used when next is called with no parameters
  */

app.use(function (req, res, next) {
  next((0, _httpErrors["default"])(404));
});
/**
  * Error handler
  */

app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  if (app.get('env') === 'dev') {
    console.error('\x1b[2m', err);
    res.json({
      error: err
    });
  } else {
    res.json({
      error: err
    });
  }
});
var _default = app;
exports["default"] = _default;