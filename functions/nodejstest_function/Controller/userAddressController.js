const catalyst = require('zcatalyst-sdk-node');
const { Datastore } = require('zcatalyst-sdk-node/lib/datastore/datastore');


exports.testAddress = async(req, res)=>{
 res.status(200).json({success:true, message:"I am live !"});
}

exports.createAddress = async(req, res)=>{
    try{
        const adminApp = catalyst.initialize(req, {scope:"admin"});
        const fomData =  req.body;
        console.log("create===>", fomData);

        const payload = {
            userId: fomData?.userId,
            pincode: fomData?.pincode,
            houserNumber: fomData?.houserNumber,
            street: fomData?.street
        }
        console.log("payload", payload)
        const addressResp = await adminApp.datastore().table("address").insertRow(payload);
        res.status(201).json({success:true, message:"Address created successfully", addressResp});
    
    }catch(error){
        res.status(409).json({success:false, message:"somthing went wrong!!"})
    }
}

