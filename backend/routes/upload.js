import express from "express";
import path from "path";

import { adminHandler, authHandler } from "../middlewares/authHandler.js";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    console.log(fileName);
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const validTypes = /png|jpg|jpeg/;
  const isValidFileType = validTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isValidMimeType = validTypes.test(file.mimetype.toLowerCase());
  console.log(isValidFileType);
  console.log(isValidMimeType);
  if (isValidFileType && isValidMimeType) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.put(
  "/",
  authHandler,
  adminHandler,
  upload.single("image"),
  (req, res) => {
    res.json({ url: `/uploads/${req.file.filename}` });
  }
);

export default router;
