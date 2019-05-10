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
}, { _id: false });

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  secureUrl: { type: String, required: true },
  id: { type: String, required: true },
}, { _id: false });

// const denver = { type: 'Point', coordinates: [-104.9903, 39.7392] };

const occurenceSchema = new mongoose.Schema({
  description: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['assault', 'robbery'] },
  itemsLost: { type: String, required: true },
  itemsPics: { type: [imageSchema], required: false },
  locationPics: { type: [imageSchema], required: false },
  folder: { type: String, required: false },
  location: { type: pointSchema, required: true },
  address: { type: String, required: true },
  deleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true, versionKey: false });

occurenceSchema.set('toJSON', { virtuals: true });
occurenceSchema.index({ location: '2dsphere' });

const Occurence = mongoose.model('Occurence', occurenceSchema);

export default Occurence;
