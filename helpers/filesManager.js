import multer from 'multer';
import {
  moveSync, ensureDirSync, pathExistsSync, removeSync,
} from 'fs-extra';
import path from 'path';

const storage = multer.diskStorage({
  async destination(req, file, cb) {
    try {
      await ensureDirSync(`${process.env.PATH_UPLOAD}`);
      const destinationFolder = `${process.env.PATH_UPLOAD}`;
      cb(null, destinationFolder);
    } catch (err) {
      cb(err);
    }
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

export default upload;