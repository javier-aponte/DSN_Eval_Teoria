import Multer from 'multer';
import path from 'path';

/* const storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where you want to store the uploaded files
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    // Define the filename for the uploaded file
    cb(null, file.originalname);
  }
}); */

const storage = Multer.memoryStorage();

export const upload = Multer({ storage: storage });