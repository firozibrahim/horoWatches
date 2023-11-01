const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const userAuth= require("../middlewares/userAuth");
const userBlock=require("../middlewares/userBlock")

//login
router.get("/",userAuth.userExist,userController.home);
router.get("/tologin",userAuth.userExist, userController.tologin);
router.post("/user/login",userAuth.userExist,userController.userLogin)


//signUp
router.get("/user/tosignUp",userAuth.userExist,userController.tosignUp);
router.post("/user/signUp",userAuth.userExist,userController.signUp)
router.get("/user/signUp",userAuth.userExist,userController.signUp)
router.get("/user/tootp",userAuth.userExist,userController.otpSender)
router.get("/user/otp",userAuth.userExist,userController.otp)
router.post("/user/otp",userAuth.userExist,userController.validateOtp)
router.get("user/home",userAuth.userExist,userController.home)
//forgot password
router.get("/user/forget-pass",userAuth.userExist,userController.toForgotPass)
router.post("/user/forget-pass",userAuth.userExist,userController.forgotPass)
router.post("user/pass-change",userAuth.userExist,userController.passwordReset)

router.get("/user/home",userAuth.verifyUser,userBlock,userController.userLog)


module.exports = router;
