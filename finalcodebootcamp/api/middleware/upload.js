const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Upload only images file.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,  __basedir+"/resources/static/assets/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

var upload = multer({ storage: storage, fileFilter: imageFilter });
module.exports = upload;
