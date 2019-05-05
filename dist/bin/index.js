#!/usr/bin/env node

/**
 * Module dependencies.
 */
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _http = _interopRequireDefault(require("http"));

var _debug = _interopRequireDefault(require("debug"));

var _app = _interopRequireDefault(require("../app"));

var _db = _interopRequireDefault(require("../db"));

var _enviroment = _interopRequireDefault(require("../config/enviroments/enviroment"));

// import env from '../config/enviroments/enviroment';

/**
 * Creates server debug to API Service
 */
// dotenv.config({ path: env() });
var serverDebug = (0, _debug["default"])('reportIt:api');
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Get port from environment and store in Express.
 */


var port = normalizePort(process.env.PORT || '3000');

_app["default"].set('port', port);
/**
 * Create HTTP server.
 */


var server = _http["default"].createServer(_app["default"]);
/**
 * Event listener for HTTP server "error" event.
 */


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? "Pipe ".concat(port) : "Port ".concat(port); // handle specific listen errors with friendly messages

  switch (error.code) {
    case 'EACCES':
      console.error("".concat(bind, " requires elevated privileges"));
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error("".concat(bind, " is already in use"));
      process.exit(1);
      break;

    default:
      throw error;
  }
}
/**
 * Event listener for HTTP server "listening" event.
 */


function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? "pipe ".concat(addr) : "port ".concat(addr.port);
  serverDebug("Listening on ".concat(bind));
}
/**
 * Listen on provided port, on all network interfaces.
 */


(0, _db["default"])().then(function () {
  serverDebug("Connected to ".concat(_enviroment["default"].DB_NAME));
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
});