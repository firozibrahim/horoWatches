const express=require('express')
const router=express.Router()
const users=require('../model/usermodel')
const adminController=require('../controller/adminController')
const productController=require('../controller/productController')
const dashController=require('../controller/dashController')
const multer=require('multer')
const upload = require("../middlewares/multer");
const Products = require("../model/productModel");
const adminAuth=require('../middlewares/adminAuth')



router.get("/",adminAuth.verifyAdmin,adminController.toDashBoard);
router.get("/toproducts",adminAuth.verifyAdmin,adminController.toProduct);
router.get('/add-products',adminAuth.verifyAdmin,productController.toAddProduct);
router.get('/customers',adminAuth.verifyAdmin,adminController.userDataSharing);
router.get('/logout',adminAuth.verifyAdmin, adminController.signout)
router.get('/category',adminAuth.verifyAdmin,adminController.tocategory)
router.get('/add-category',adminAuth.verifyAdmin,adminController.toAddCategory)
router.post('/addcategory',adminAuth.verifyAdmin,adminController.addCategory)
router.get('edit-category',adminAuth.verifyAdmin,adminController.toEditcategory)
router.get('/edit-category/:id',adminAuth.verifyAdmin,adminController.editCatagory)
router.post('/DoneEdit-category/:id',adminAuth.verifyAdmin,adminController.afterEditCatagory)
router.get('/delete-category/:id',adminAuth.verifyAdmin,adminController.deleteCatagory)
router.post("/addproduct", upload.array('productMainImage',4),productController.addProduct);
router.get('/edit-product/:id',adminAuth.verifyAdmin,productController.toEditProduct)
router.get('/delete-product/:id',adminAuth.verifyAdmin,productController.deleteProduct)
const uploadField=[
    {name:"productMainImage0",maxCount:1},
    {name:"productMainImage1",maxCount:1},
    {name:"productMainImage2",maxCount:1},
    {name:"productMainImage3",maxCount:1},
]
router.post('/postEdit-product/:id',upload.fields(uploadField),productController.EditProduct)
router.get('/block/:id',adminController.UserStatus)
router.post("/userSearch",adminAuth.verifyAdmin,adminController.userSearch);
router.post("/search", adminAuth.verifyAdmin,productController.searchProduct)

// router.post('/edit-product/:id',adminController.EditProduct)

// //login
// // admin.get('/admin',adminAuth.adminExist,adminController.toLogin)
// // admin.post('/log',adminAuth.adminExist,adminController.loginadmin)
// admin.get('/',adminAuth.verifyAdmin,adminController.toDashBoard)


// admin.get('/toproducts',adminController.toproducts)
// admin.get('/products',adminController.productData)


// admin.get('/products',adminAuth.verifyAdmin,adminController.toProduct)
// admin.get('/catogory',adminAuth.verifyAdmin,adminController.categoryData)


router.get('/orders',adminAuth.verifyAdmin,adminController.toOrders)
router.put('/updateStatus/:orderId',adminAuth.verifyAdmin,adminController.orderStatus)
router.get('/orderView/:id',adminAuth.verifyAdmin,adminController.orderview)

router.get("/count-orders-by-day",adminAuth.verifyAdmin,dashController.salesReport)
router.get("/count-orders-by-month",adminAuth.verifyAdmin,dashController.salesReport)
router.get("/count-orders-by-year",adminAuth.verifyAdmin,dashController.salesReport)
router.get('/latestOrders',adminAuth.verifyAdmin,dashController.getOrdersAndSellers)
router.post('/download-sales-report',adminAuth.verifyAdmin,dashController.generateSalesReport)








module.exports=router;