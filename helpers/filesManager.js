import multer from 'multer';
import uid from 'uuid/v4';
// import {
//   moveSync, ensureDirSync, pathExistsSync, removeSync,
// } from 'fs-extra';
// import path from 'path';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import env from '../config/enviroments/enviroment';

cloudinary.config({
  cloud_name: `${env.CLOUD_NAME}`,
  api_key: `${env.API_KEY}`,
  api_secret: `${env.API_SECRET}`,
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: `reportIt/occurences/${uid()}`,
  allowedFormats: ['jpg', 'png'],
  transformation: [{
    width: 500, height: 500, crop: 'limit', fetch_format: 'auto', quality: 'auto',
  }],
});

const profileStorage = cloudinaryStorage({
  cloudinary,
  folder(req, file, cb) {
    cb(null, `reportIt/profile/${uid()}`);
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
