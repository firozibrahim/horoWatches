const sendOTP = require("./otpController")
const Users = require("../model/usermodel")
const Cart = require("../model/cartModel");
const productUpload = require("../model/productModel");


const toCart = async(req,res)=>{
    console.log("to cart");
 try {
     const email= req.session.email;
    const user =await Users.findOne({Email:email})
    // console.log("user",user);
    const userId = user._id;
    const cart = await Cart.findOne({userId:userId}).populate("products.productId")
    if (!cart || cart.products.length === 0) {
        // console.log("this .........inside of if");
        return res.render('user/cart', {
          username: email,
          product: [],
          subtotal: 0,
          total: 0,
          coupon: 0,
          gstAmount: 0,
          totalQuantity: 0
  
        });
      }
    const products= cart.products
    let subtotal=0
    let totalQuantity=0;
    cart.products.forEach(item=>{
        if(item.productId&&item.productId.DiscountAmount!==undefined){
            console.log(item.quantity);
            subtotal += item.quantity*item.productId.DiscountAmount;
            totalQuantity+=item.quantity;
        }else{
            console.log("item missing",item.productId);
        }
    })
    const gstRate=0.18
    const gstAmount=subtotal*gstRate
    const total=subtotal+gstAmount
    req.session.totalPrice=total


    res.render("user/cart",{
        username:email,
        product:products,
        newcart:cart,
        subtotal:subtotal,
        gstAmount:gstAmount.toFixed(2),
        totalQuantity:totalQuantity,
        total:total.toFixed(2),
    })
 } catch (error) {
    console.log("error in cart view");
    res.render("user/404")
    throw error
 }

}

const addToCart = async (req,res)=>{
    console.log("cart",req.body);
    try{
        const user= await Users.findOne({Email:req.session.email});
        const userId = user._id
        console.log(user.Username);

        const {itemId}= req.body;
        let productId= itemId;
        let cartData = await Cart.findOne({userId:userId})
        let product  = await productUpload.find({_id:productId})

        if(cartData!==null){
            console.log("not null");
            const productIndex = cartData.products.findIndex(item=>item.productId.toString()===productId.toString());
        
            if(productIndex !== -1){
                cartData.products[productIndex].quantity +=1
            }else{
                cartData.products.push({productId:productId,quantity:1,Price:product.Price})
            }
            await cartData.save()
            req.session.userCart=cartData._id
            res.json({success:true,message:"item added to cart"})
        }else{
            console.log("null");
            cartData = await Cart.create([{
                userId:userId,
                products:[{productId:productId,quantity:1,Price:product.Price}]
            }])
            req.session.userCart = cartData._id
            res.json({success:true,message:"item added to cart"})
        }
    }catch(error){
        console.log("error while adding to cart",error);
        res.render("user/404page")
    }
}
const addlistToCart = async (req,res)=>{
    try {
        const user =await Users.findOne({Email:req.session.email})
        console.log(req.session.email);
        const userId = user._id;
        console.log(user.Username);
        const itemId = req.params.id
        const productId = itemId
        let cartData = await Cart.findOne({userId:userId})
        console.log("cart data:",cartData);
        let product  = await productUpload.find({_id:productId})
        

        if(cartData !== null){
            const productIndex = cartData.products.findIndex(item=>item.productId.toString()===productId.toString())
            if(productIndex!==-1){
                cartData.products[productIndex].quantity+=1
            }else{
                cartData.products.push({productId:productId,quantity:1,Price:product.Price})
            }
            await cartData.save();
            res.json({succes:true,message:"items added to cart"})
        }else{
            cartData = await Cart.create([{
                userId:userId,
                products:[{productId:productId,quantity:1,Price:product.Price}]
            }])
            
            res.json({succes:true,message:"items added to cart"})
        }

    } catch (error) {
        console.log(error)
        
    }
}
const updatequantity = async (req,res)=>{
    const {productId,quantity,cartId}=req.body
    try {
        console.log(`product id :${productId},quantity:${quantity},cart id${cartId}`);
        const newcart = await Cart.findOne({_id:cartId}).populate("products.productId")
        // console.log(newcart);
        if(!newcart){
            return res.status(404).json({success:false,error:"cart not found"})
        }
        const productInCart = newcart.products.find(item=>item.productId.equals(productId))
        // console.log("product in cart:",productInCart);
        if(!productInCart){
            return res.status(404).json({success:false,error:"product not found in the cart"})
        }
        productInCart.quantity= quantity
        await newcart.save()
        
        let subtotal = 0;
        let totalQuantity = 0;

        newcart.products.forEach(item=>{
        const {quantity,productId}= item;
        const {DiscountAmount}=productId;
        subtotal+=quantity*DiscountAmount;
        totalQuantity+=quantity;

        });
        return res.status(200).json({
            success:true,
            message:"cart updated successfully",
            subtotal,
            totalQuantity,

        })

    } catch (error) {
        // res.render("user/404")
        console.log(error);
        return res.status(500).json({success:false,error:error.message})
    }
}
const removeCart = async (req,res)=>{
    try {
        const email = req.session.email;
        const user = await Users.findOne({Email:email})
        const userId = user._id;
        const {productId}= req.body;
        
        
        const userCart = await Cart.findOne({userId:userId})
        userCart.products = userCart.products.filter((item)=>!item.productId.equals(productId));
        await userCart.save()
        res.json({success:true,message:"item removed from cart"})
    } catch (error) {
        console.log("error removing item",error)
        res.status(500).json({success:false,message:"error removing item from cart"})
    }
}

module.exports ={
    addToCart,
    addlistToCart,
    toCart,
    updatequantity,
    removeCart,
}