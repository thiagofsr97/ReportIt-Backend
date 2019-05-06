import multer from 'multer';
import uid from 'uuid/v4';
// import {
//   moveSync, ensureDirSync, pathExistsSync, removeSync,
// } from 'fs-extra';
// import path from 'path';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import { Error as errMongo } from 'mongoose';
import path from 'path';
import env from '../config/enviroments/enviroment';
import Occurrence from '../models/occurrence';
import User from '../models/user';

cloudinary.config({
  cloud_name: `${env.CLOUD_NAME}`,
  api_key: `${env.API_KEY}`,
  api_secret: `${env.API_SECRET}`,
});


const storage = cloudinaryStorage({
  cloudinary,
  folder: async (req, file, cb) => {
    const { baseUrl } = req;
    let pathToSave = path.join('reportIt', baseUrl);
    const { id } = req.params;
    if (!id) {
      pathToSave = path.join(pathToSave, uid());
    } else {
      try {
        let destination;
        if (baseUrl.match(/^\/ {2}occurrences$/)) {
          destination = await Occurrence.findById(id, 'folder');
        } else {
          destination = await User.findById(id, 'folder');
        }
        if (!destination) {
          pathToSave = path.join(pathToSave, uid());
        }
        pathToSave = destination.folder;
      } catch (err) {
        if (err instanceof errMongo.CastError) {
          pathToSave = path.join(pathToSave, uid());
        }
      }
    }
    cb(null, pathToSave);
  },
  allowedFormats: ['jpg', 'png'],
  transformation: (req, file, cb) => {
    const { baseUrl } = req;

    if (baseUrl.match(/^\/occurrences$/)) {
      cb(null, [{
        width: 500, height: 500, crop: 'limit', fetch_format: 'auto', quality: 'auto',
      }]);
    } else {
      cb(null, [{
        width: 90, height: 90, gravity: 'face', crop: 'thumb', fetch_format: 'auto', quality: 'auto',
      }]);
    }
  },
});

const upload = multer({ storage });

export default upload;
