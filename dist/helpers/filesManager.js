"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadProfile = exports.upload = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _multer = _interopRequireDefault(require("multer"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _cloudinary = _interopRequireDefault(require("cloudinary"));

var _multerStorageCloudinary = _interopRequireDefault(require("multer-storage-cloudinary"));

var _mongoose = require("mongoose");

var _enviroment = _interopRequireDefault(require("../config/enviroments/enviroment"));

var _occurrence = _interopRequireDefault(require("../models/occurrence"));

var _user = _interopRequireDefault(require("../models/user"));

// import {
//   moveSync, ensureDirSync, pathExistsSync, removeSync,
// } from 'fs-extra';
// import path from 'path';
_cloudinary["default"].config({
  cloud_name: "".concat(_enviroment["default"].CLOUD_NAME),
  api_key: "".concat(_enviroment["default"].API_KEY),
  api_secret: "".concat(_enviroment["default"].API_SECRET)
});

var storage = (0, _multerStorageCloudinary["default"])({
  cloudinary: _cloudinary["default"],
  folder: function () {
    var _folder = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee(req, file, cb) {
      var id, occurenceFolder;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              id = req.params.id;

              if (!id) {
                _context.next = 7;
                break;
              }

              _context.next = 4;
              return _occurrence["default"].findById(id, 'folder');

            case 4:
              occurenceFolder = _context.sent;
              console.log(occurenceFolder);
              occurenceFolder = occurenceFolder.folder;

            case 7:
              if (occurenceFolder) {
                cb(null, occurenceFolder);
              } else {
                cb(null, "reportIt/occurrences/".concat((0, _v["default"])()));
              }

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function folder(_x, _x2, _x3) {
      return _folder.apply(this, arguments);
    }

    return folder;
  }(),
  allowedFormats: ['jpg', 'png'],
  transformation: [{
    width: 500,
    height: 500,
    crop: 'limit',
    fetch_format: 'auto',
    quality: 'auto'
  }]
});
var profileStorage = (0, _multerStorageCloudinary["default"])({
  cloudinary: _cloudinary["default"],
  folder: function () {
    var _folder2 = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2(req, file, cb) {
      var id, profileFolder;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              id = req.params.id;

              if (!id) {
                _context2.next = 16;
                break;
              }

              _context2.prev = 2;
              _context2.next = 5;
              return _user["default"].findById(id, 'folder');

            case 5:
              profileFolder = _context2.sent;
              _context2.next = 13;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](2);

              if (!(_context2.t0 instanceof _mongoose.Error.CastError)) {
                _context2.next = 13;
                break;
              }

              cb(null, "reportIt/profile/".concat((0, _v["default"])()));
              return _context2.abrupt("return");

            case 13:
              cb(null, profileFolder.folder);
              _context2.next = 17;
              break;

            case 16:
              cb(null, "reportIt/profile/".concat((0, _v["default"])()));

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[2, 8]]);
    }));

    function folder(_x4, _x5, _x6) {
      return _folder2.apply(this, arguments);
    }

    return folder;
  }(),
  allowedFormats: ['jpg', 'png'],
  transformation: [{
    width: 90,
    height: 90,
    crop: 'thumb',
    gravity: 'face',
    quality: 'auto',
    fetch_format: 'auto'
  }]
});
var upload = (0, _multer["default"])({
  storage: storage
});
exports.upload = upload;
var uploadProfile = (0, _multer["default"])({
  profileStorage: profileStorage
}); // const storage = multer.diskStorage({
//   async destination(req, file, cb) {
//     try {
//       await ensureDirSync(`${process.env.PATH_UPLOAD}`);
//       const destinationFolder = `${process.env.PATH_UPLOAD}`;
//       cb(null, destinationFolder);
//     } catch (err) {
//       cb(err);
//     }
//   },
//   filename(req, file, cb) {
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

exports.uploadProfile = uploadProfile;