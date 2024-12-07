const catalyst = require("zcatalyst-sdk-node");
const query = require("../SQL/userQuery");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const os =  require("os");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.testConnection = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "I am live!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "I'm not live!", error });
  }
};
exports.login = async (req, res) => {
  try {
    const formData = req.body;
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    console.log("formData", formData);
    const useremail = `SELECT * FROM users WHERE email = '${formData.email}'`;
    const user = await catalystApp.zcql().executeZCQLQuery(useremail);
    if (!user.length > 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const usserPass = user[0]?.users?.password;
    const comparePassword = await bcrypt.compare(formData.password, usserPass);
    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials Please check you email and password",
      });
    }
    const token = await jwt.sign({ id: user.ROWID }, JWT_SECRET);
    res
      .status(200)
      .json({ success: true, message: "user successfully login", token, user });
  } catch (error) {
    res.status(409).json({ success: false, message: "Something went wrong" });
  }
};

// *********USER REGISTRATION*********
exports.creteUser = async (req, res) => {
  const catalystApp = catalyst.initialize(req, { scope: "admin" });
  try {
    const user = req.body;
    const encodedPassword = await bcrypt.hash(user.password, 10);
    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: encodedPassword,
    };
    const useremail = `SELECT * FROM users WHERE email = '${userData.email}'`;
    const checkUser = await catalystApp.zcql().executeZCQLQuery(useremail);
    if (checkUser.length > 0) {
      res
        .status(203)
        .json({ success: true, message: "email id is already exists" });
    }
    const userResult = await catalystApp
      .datastore()
      .table("users")
      .insertRow(userData);
    res.status(200).json({
      success: true,
      message: "user successfully created",
      data: userResult,
    });
  } catch (error) {
    res.status(409).json({
      success: false,
      message: "user not created",
      error: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    const userQuery = query.getUser;
    const userResp = await catalystApp.zcql().executeZCQLQuery(userQuery);
    const userDetails = userResp.map((item) => ({
      name: item?.users?.name,
      rowId: item?.users?.ROWID,
      email: item?.users?.email,
      phone: item?.users?.phone,
      password: item?.users?.password,
    }));
    res
      .status(200)
      .json({ success: true, message: "Get user successfully ", userDetails });
  } catch (error) {
    res.status(409).json({ success: false, message: "user not found", error });
  }
};

exports.downloadImage = async(req, res) =>{
  try{
    const app = catalyst.initialize(req, {scope:"admin"});
    let filestore = app.filestore(); 
    let folder = filestore.folder("11771000000438010"); 
    let downloadPromise =await folder.downloadFile("11771000000438047"); 
    console.log("image download", downloadPromise);
    downloadPromise.then((fileObject) => 
    { 
    console.log(fileObject); 
    });
    
  }catch (error) {
    res.status(500).json({ success: false, message: "Error downloading image", error });
  }
}
exports.updateUser = async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req, { "scope": "admin" });
    const fileStore = catalystApp.filestore();
    // let attachmentFolderId = fileStore.folder("11771000000438010"); 
      const formData = req.body;
      const rowId = req.params.id;
      console.log("rowid =", rowId);
      let filesArr = [];
      if (req.files.length) {
        const attachments = req.files || [];
        filesArr = await uploadFiles(fileStore, "11771000000438010", attachments);
      }
      console.log({ formData, filesArr });
      const userData = {       
        imageId	: filesArr[0].id,
      };
      const response = await catalystApp.datastore().table('users').updateRow({...userData, ROWID:rowId});
      console.log(response)
      if (response && response.ROWID) {
          res.status(200).json({ success: true, message: " User image Update successfully!", ROWID: response.ROWID });
      } else {
          res.status(500).json({ success: false, message: "Failed to upload image. No ROWID returned." });
      }
  } catch (error) {
      console.error('Error creating client:', error); 
      res.status(409).json({ success: false, message: "Failed! Cannot upload image!", error: error.message });
  }
};

async function uploadFiles(fileStore, attachmentFolderId, files) {
 try{
  const fileStoreInstance = fileStore.folder(attachmentFolderId);
  if(files.length === 0){
      return [];
  }
  const uploadPromises = files.map(async (file) => {
    const config = {
      code: fs.createReadStream(file.path),
      name: file.originalname,
    };
    return await fileStoreInstance.uploadFile(config);
  })
  return await Promise.all(uploadPromises);
 }catch(error){
   console.error('Error uploading file:', error);
   throw new Error('Failed to upload file!');
 } 
}
