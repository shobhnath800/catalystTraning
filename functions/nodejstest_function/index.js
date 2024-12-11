
const express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.json());

const userRouter = require("./Router/userRouter");

const userAddress =  require("./Router/userAddress");

app.use("/user/api/v1/",userRouter);
app.use("/useraddress/api/v1/", userAddress);

module.exports = app;