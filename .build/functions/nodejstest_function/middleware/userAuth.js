const jwt = require("jsonwebtoken");
 const JWT_SECRET = process.env.JWT_SECRET;

 const jwtAuthMiddleware = (req, res, next) =>{
    const token = req.header("auth-token");
    if(!token) {
        return res.status(401).json({ err: "Authenticate using valid token" });
    }
    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data;
        next();
    }catch(error){
        res.status(401).json({ err: "Authenticate using invalid token",error});
    }
 } 


 module.exports = jwtAuthMiddleware;