"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _enviroment = _interopRequireDefault(require("../config/enviroments/enviroment"));

// import thumbnailPluginLib from 'mongoose-thumbnail';
// import path from 'path';
// const { thumbnailPlugin, make_upload_to_model } = thumbnailPluginLib;
// const uploads_base = path.join('/', 'uploads_dev');
// const uploads = path.join(uploads_base, 'u');
var userSchema = new _mongoose["default"].Schema({
  access: {
    type: String,
    required: false,
    "default": 'standard'
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  dateBirth: {
    type: Date,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true
  },
  picture: {
    url: String,
    id: String
  },
  deleted: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true,
  versionKey: false
});
userSchema.set('toJSON', {
  virtuals: true
}); // userSchema.plugin(thumbnailPlugin, {
//   name: 'profile',
//   inline: true,
//   save: true,
// });
// encrypt password before save

userSchema.pre('save', function (next) {
  var user = this;
  console.log(user.isModified());

  if (!user.isModified()) {
    next();
  } else {
    _bcrypt["default"].hash(user.password, parseInt("".concat(_enviroment["default"].SALTING_ROUNDS), 10), function (err, hash) {
      if (err) {
        console.log('Error hashing password for user', user.name);
        next(err);
      } else {
        user.password = hash;
        next();
      }
    });
  }
});

var User = _mongoose["default"].model('Request', userSchema);

var _default = User;
exports["default"] = _default;