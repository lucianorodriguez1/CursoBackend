import multer from 'multer';
import path from 'path';

const __dirname = path.resolve();

const getDestinationFolder = (file) => {
  const fileType = file.mimetype.split('/')[0];
  
  switch (fileType) {
    case 'image':
      return path.join(__dirname, '/public/img');
    case 'video':
      return path.join(__dirname, '/public/videos');
    case 'application':
      return path.join(__dirname, '/public/documents');
    default:
      return path.join(__dirname, '/public/others');
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getDestinationFolder(file);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

export const uploader = multer({ storage });
