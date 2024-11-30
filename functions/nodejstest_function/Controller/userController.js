const catalyst = require("zcatalyst-sdk-node");
const query = require("../SQL/userQuery");
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET =  process.env.JWT_SECRET;

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
    const token = await jwt.sign({id: user.ROWID}, JWT_SECRET);
    res
      .status(200)
      .json({ success: true, message: "user successfully login",token, user });
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
