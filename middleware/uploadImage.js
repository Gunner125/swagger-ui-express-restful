const multer = require('multer');

const multerStorage = multer.diskStorage({
      filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now());
      }
});

const fileFilter = (req, file, cb) => {
      const fileSize = parseInt(req.headers['content-length']);
      if ((file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/octet-stream') && (fileSize <= 1282810)) {
            cb(null, true);
      } else {
            cb(null, false);
      }
};

const uploads = multer({ storage: multerStorage, fileFilter: fileFilter });

module.exports = uploads;