const express = require('express');
const jwtAuthMiddleware =  require("../middleware/userAuth");

const multer=require("multer");


// Multer middleware configuration for uploading files.
const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "temp/attachments");
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
  });

// console.log("uploading", upload);

const userRouter = express.Router();

const {testConnection,creteUser,getUser,login,updateUser,downloadImage} = require("../Controller/userController");
userRouter.post("/update-user/:id?", upload.array("file",10), updateUser);
userRouter.post("/download-image", downloadImage);
userRouter.get("/test-connection", testConnection);
userRouter.post("/create-user", creteUser);
userRouter.get("/get-user",jwtAuthMiddleware, getUser);
userRouter.post("/user-login", login);

module.exports = userRouter;