const express = require('express');
var cors = require('cors');
var app = express();
 
app.use(cors());
app.use(express.json());

const userRouter = express.Router();

const {testConnection,creteUser,getUser} = require("../Controller/userController");
userRouter.get("/test-connection", testConnection);
userRouter.post("/create-user", creteUser);
userRouter.get("/get-user", getUser);

module.exports = userRouter;