const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const filterController = require("../controller/filter")
const errorHandler = require("../middlewares/errorHandler")
const productController=require('../controller/productController')
const userAuth= require("../middlewares/userAuth");
const userBlock=require("../middlewares/userBlock");

//login
router.get("/",userAuth.userExist,userController.home);
router.get("/tologin",userAuth.userExist, userController.tologin);

// router.get("/user/tologin",userAuth.userExist,userController.tologin)    
router.post("/user/login",userAuth.userExist,userController.login)


//signUp
router.get("/user/tosignUp",userAuth.userExist,userController.tosignUp);
router.get("/user/signUp",userAuth.userExist,userController.signUp)
router.post("/user/signUp",userAuth.userExist,userController.signUp)
router.get("/user/tootp",userAuth.userExist,userController.otpSender)
router.get("/user/otp",userAuth.userExist,userController.otp)
router.post("/user/otp",userAuth.userExist,userController.validateOtp)
router.get("/user/home",userAuth.verifyUser,userController.home)
//forgot password
router.get("/user/forget-pass",userAuth.userExist,userController.toForgotPass)
router.post("/user/forget-pass",userAuth.userExist,userController.forgotPass)
router.get("/user/pass-change",userAuth.userExist,userController.toNewpassword)
router.post("/user/new-pass",userAuth.userExist,userController.passwordReset)
router.get("/user/resend-otp",userAuth.userExist,userController.otpSender)

// router.get("/user/home",userAuth.verifyUser,userBlock,userController.userLog)
//logout
router.get("/user/toProduct-list",productController.toProductList)
router.get("/user/logout",userController.logout)
router.get("/user/all-products",filterController.allproduct)
router.get("/user/filter-products/:brand",filterController.filter)
router.get("/user/toproductView/:id",productController.productView)


module.exports = router;
