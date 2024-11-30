const express = require('express');
var cors = require('cors');
var app = express();
const jwtAuthMiddleware =  require("../middleware/userAuth");
app.use(cors());
app.use(express.json());


const userRouter = express.Router();

const {testConnection,creteUser,getUser,login} = require("../Controller/userController");
userRouter.get("/test-connection", testConnection);
userRouter.post("/create-user", creteUser);
userRouter.get("/get-user",jwtAuthMiddleware, getUser);
userRouter.post("/user-login", login);

module.exports = userRouter;