import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  id: { type: String, required: true },
});

// const denver = { type: 'Point', coordinates: [-104.9903, 39.7392] };

const occurenceSchema = new mongoose.Schema({
  description: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['assault', 'robbery'] },
  itemsLost: { type: [String], required: true },
  location: { type: pointSchema, required: true },

}, { versionKey: false });
