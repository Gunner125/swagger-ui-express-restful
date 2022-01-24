const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
      destination: (req, file, cb) => {
            cb(null, 'images');
      },
      filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
      },
});

const fileFilter = (req, file, cb) => {
      const fileSize = parseInt(req.headers['content-length']);
      if ((file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/octet-stream') && (fileSize <= 1282810)) {
            cb(null, true);
      } else {
            cb(null, false);
      }
};

const uploads = multer({ storage: storage, fileFilter: fileFilter });

module.exports = uploads;