const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const filterController = require("../controller/filter")
const errorHandler = require("../middlewares/errorHandler")
const productController=require('../controller/productController')
const cartController=require('../controller/cartController')
const orderController=require('../controller/orderController')
const passwordController =require('../controller/forgetPassword')
const userAuth= require("../middlewares/userAuth");
const imgUpload=require('../middlewares/profile-multer')
const userBlock=require("../middlewares/userBlock");
const { verifyAdmin } = require("../middlewares/adminAuth");

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
router.get("/user/toProduct-list",userAuth.verifyUser,productController.toProductList)
router.get("/user/products",userAuth.verifyUser,filterController.filter)
router.get("/user/logout",userAuth.verifyUser,userController.logout)
router.get("/user/all-products",userAuth.verifyUser,filterController.allproduct)
// router.get("/user/filter-products",userAuth.verifyUser,filterController.filter)
router.get("/user/toproductView/:id",userAuth.verifyUser,productController.productView)

router.get("/user/cart",userAuth.verifyUser,cartController.toCart)
router.post('/user/addToCart',userAuth.verifyUser,cartController.addToCart)
router.post('/user/AddToCart/:id',userAuth.verifyUser,cartController.addlistToCart)
router.post('/user/updatequantity',userAuth.verifyUser,cartController.updatequantity)
router.post('/user/removeFromCart/:id',userAuth.verifyUser,cartController.removeCart)

router.get("/user/account",userAuth.verifyUser,userController.userData)
router.post("/user/addAddress",userAuth.verifyUser,userController.addAddress)
router.get("/user/toManageAddress",userAuth.verifyUser,userController.toManageAddress)
router.post("/user/deleteAddress/:id",userAuth.verifyUser,userController.deleteAddress)
router.post("/user/editAddress/:id",userAuth.verifyUser,userController.editAddress)

router.get("/user/toCheckout",userAuth.verifyUser,orderController.toCheckout)
router.post('/user/placeOrder',userAuth.verifyUser,orderController.placeOrder)
router.get("/user/ordersuccess",userAuth.verifyUser,orderController.success)
router.get('/user/toOrderPage',userAuth.verifyUser,orderController.toOrderPage)

router.post("/user/cancelOrder/:id",userAuth.verifyUser,orderController.cancelOrder)
router.post('/Onecancel-order',userAuth.verifyUser, orderController.oneItemcancel)
router.get("/user/toorderDetails/:id",userAuth.verifyUser,orderController.orderDetails)
router.post('/return-order',userAuth.verifyUser,orderController.returnOrder)
router.post('/user/verifyPayment',userAuth.verifyUser,orderController.verifyPayment)

router.get("/user/changePass",userAuth.verifyUser,userController.toAccountSettings)
router.post('/user/change-password',userAuth.verifyUser,passwordController.changePass);
router.post('/user/uploadProfileImage',imgUpload.single('profileImage'),userController.userProfile)

module.exports = router;
