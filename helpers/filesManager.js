import multer from 'multer';
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
  folder: 'reportIt',
  allowedFormats: ['jpg', 'png'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }],
});

const upload = multer({ storage });


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


export default upload;
