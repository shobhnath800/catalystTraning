const express = require('express');

const addressRouter= express.Router();

const {testAddress,createAddress} = require("../Controller/userAddressController");

addressRouter.get('/address-test', testAddress);
addressRouter.post('/create-address', createAddress);

module.exports=  addressRouter;


