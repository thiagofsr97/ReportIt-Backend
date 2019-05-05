"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var pointSchema = new _mongoose["default"].Schema({
  type: {
    type: String,
    "enum": ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
}, {
  _id: false
});
var imageSchema = new _mongoose["default"].Schema({
  url: {
    type: String,
    required: true
  },
  secureUrl: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
}, {
  _id: false
}); // const denver = { type: 'Point', coordinates: [-104.9903, 39.7392] };

var occurenceSchema = new _mongoose["default"].Schema({
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    "enum": ['assault', 'robbery']
  },
  itemsLost: {
    type: [String],
    required: true
  },
  itemsPics: {
    type: [imageSchema],
    required: false
  },
  locationPics: {
    type: [imageSchema],
    required: false
  },
  folder: {
    type: String,
    required: false
  },
  location: {
    type: pointSchema,
    required: true
  },
  deleted: {
    type: Boolean,
    "default": false
  },
  createdBy: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  versionKey: false
});
occurenceSchema.set('toJSON', {
  virtuals: true
});
occurenceSchema.index({
  location: '2dsphere'
});

var Occurence = _mongoose["default"].model('Occurence', occurenceSchema);

var _default = Occurence;
exports["default"] = _default;