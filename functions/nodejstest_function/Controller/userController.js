const catalyst = require("zcatalyst-sdk-node");
const { Email } = require("zcatalyst-sdk-node/lib/email/email");

exports.testConnection = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "I am live!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "I'm not live!", error });
  }
};

// *********USER REGISTRATION*********
exports.creteUser = async (req, res) => {
// *******FIELDS*****
// 1. name
// 2. email
// 3. mobile
// 4. dob
// 5 passwor

  try {
    const user = req.body;
    const userData = {
      name: user.name,
      email: user.email,
    };
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    const userResult = await catalystApp
      .datastore()
      .table("users")
      .insertRow(userData);
    res
      .status(200)
      .json({
        success: true,
        message: "user successfully created",
        data: userResult,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "user not created", error });
  }
};

exports.getUser =  async (req, res) =>{
    try{
        
        res.status(200).json({ success: true, message:"Get user successfully "})
    }catch(error){
        res.status(500).json({ success: false, message: "user not found", error });
    }
}