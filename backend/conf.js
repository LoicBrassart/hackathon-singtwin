const mysql = require('mysql2/promise');
const multer = require('multer');
require('dotenv').config();

const {
  DB_HOST,
  DB_USER,
  DB_SCHEMA,
  DB_PASSWORD,
  BACK_PORT,
  JWT_SALTROUNDS,
  JWT_SECRET,
} = process.env;

const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_SCHEMA,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage }).single('file');

module.exports = {
  db,
  backPort: parseInt(BACK_PORT),
  jwtRounds: parseInt(JWT_SALTROUNDS, 10),
  jwtSecret: JWT_SECRET,
  uploadFile: upload,
};
