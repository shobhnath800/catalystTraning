
const express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.json());

const userRouter = require("./Router/userRouter");

app.use("/user/api/v1/",userRouter)

module.exports = app;