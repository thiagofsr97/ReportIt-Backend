import multer from 'multer';
import uid from 'uuid/v4';
// import {
//   moveSync, ensureDirSync, pathExistsSync, removeSync,
// } from 'fs-extra';
// import path from 'path';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import { Error as errMongo } from 'mongoose';
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
  async folder(req, file, cb) {
    const { id } = req.params;
    let occurenceFolder;
    if (id) {
      occurenceFolder = await Occurrence.findById(id, 'folder');
      console.log(occurenceFolder);
      occurenceFolder = occurenceFolder.folder;
    }
    if (occurenceFolder) {
      cb(null, occurenceFolder);
    } else {
      cb(null, `reportIt/occurrences/${uid()}`);
    }
  },
  allowedFormats: ['jpg', 'png'],
  transformation: [{
    width: 500, height: 500, crop: 'limit', fetch_format: 'auto', quality: 'auto',
  }],
});

const profileStorage = cloudinaryStorage({
  cloudinary,
  async folder(req, file, cb) {
    const { id } = req.params;
    if (id) {
      let profileFolder;
      try {
        profileFolder = await User.findById(id, 'folder');
      } catch (err) {
        if (err instanceof errMongo.CastError) {
          cb(null, `reportIt/profile/${uid()}`);
          return;
        }
      }
      cb(null, profileFolder.folder);
    } else {
      cb(null, `reportIt/profile/${uid()}`);
    }
  },
  allowedFormats: ['jpg', 'png'],
  transformation: [{
    width: 90, height: 90, crop: 'thumb', gravity: 'face', quality: 'auto', fetch_format: 'auto',
  }],
});
const upload = multer({ storage });
const uploadProfile = multer({ profileStorage });


// const storage = multer.diskStorage({
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


export { upload, uploadProfile };
