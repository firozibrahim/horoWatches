const cart = require("../model/cartModel")
const Users = require("../model/usermodel")
const order = require("../model/orderModel")
const productUpload = require("../model/productModel")





const toCheckout = async (req, res) => {
    console.log("to checkout page");
    const email = req.session.email
    const TotalPrice=req.session.totalPrice
    const grandTotal=req.session.grandTotal
    console.log("email:",email,"total:",TotalPrice,"grand:",grandTotal);
    
    const userData = await Users.findOne({ Email: email })

    const Cart=await cart.findOne({userId:userData._id})
    const coupon = req.session.coupon
    res.render("user/checkoutPage", { title: "checkout  page", userData, user: userData ,Cart,TotalPrice, coupon,grandTotal})
}
const placeOrder = async (req, res) => {
    try {
      const userData = await Users.findOne({ Email: req.session.email });
      const userId = userData._id;
      const selectedAddressId = req.body.selectedAddress;
      const paymentMethod = "cod";
      console.log("d>>>>>>>>>>>>>>>>>>>>>>>>>", selectedAddressId);
      const amount=req.session.grandTotal || req.session.totalPrice;
      const amountInRupees=Math.floor(amount)
  
      const amountInPaisa = Math.round(amountInRupees * 100);
      console.log(amountInPaisa,'...........',amountInRupees);
      const selectedAddress = userData.Address.find((address) => address._id == selectedAddressId);
      console.log("..................", selectedAddress);
      if (!selectedAddress) {
        return res.status(400).json({ success: false, message: 'Selected address not found' });
      }
  
      const cartDetails = await cart.findOne({ userId: userId });
  
      const newOrder = new order({
        Status: 'Pending',
        Items: cartDetails.products,
        UserID: userId,
        paymentMethod: paymentMethod,
        Address: {
          name : selectedAddress.name,
          addressLine: selectedAddress.addressLine,
          city: selectedAddress.city,
          pincode: selectedAddress.pinCode,
          state: selectedAddress.state,
          mobileNumber: selectedAddress.MobileNumber,
        },
        TotalPrice: req.session.totalPrice,
        OrderDate: new Date(),
      });
      console.log("order saved");
      const savedOrder = await newOrder.save();
  
      if (savedOrder) {
        await cart.findOneAndDelete({ userId: userId });
  
        for (const item of cartDetails.products) {
          const productId = item.productId;
          const purchasedQuantity = item.quantity;
  
          await productUpload.findOneAndUpdate(
            { _id: productId },
            { $inc: { AvailableQuantity: -purchasedQuantity } }
          );
        }
      }
      console.log("product minused");
       
        res.json({
          success: true,
          message: "order Success"
        })
    } catch (error) {
      console.error('Error placing the order:', error);
      return res.render('user/404Page');
    }
  
  }

const success = (req,res)=>{
    res.render("user/orderSuccess")
}
const toOrderPage = async (req, res) => {
    try {
      const userData = await Users.findOne({ Email: req.session.email });
      const userId = userData._id;
      console.log(userId, '.............');
      const orderData = await order.find({ UserID: userId }).populate('Items.productId').sort({OrderDate:-1});
        
      console.log(orderData, '..................................');
  
  
  
      res.render('user/Orders', { title: 'Orders', orderData,userData });
    } catch (error) {
      console.error(error);
      res.render('user/404Page');
    }
  };
const cancelOrder = async (req,res)=>{
    try {
        const orderId = req.params.id;
        const orderData = await order.findById(orderId)

        if (orderData.Status !== 'Delivered') {
            orderData.Status = 'Cancelled';
            if (orderData.paymentMethod === 'online' || orderData.paymentMethod === 'wallet') {
              const userData = await Users.findOne({Email:req.session.email});
             
              userData.wallet += orderData.TotalPrice;
              await userData.save();
            }
            await orderData.save();
      
            for (const item of orderData.Items) {
              if (item.productId) {
                const product = await productUpload.findById(item.productId);
      
                if (product) {
                  product.AvailableQuantity += item.quantity;
                  await product.save();
                }
              }
            }
      
            return res.json({ success: true, message: 'Order has been canceled' });
          } else {
            return res.json({ success: false, message: 'Cannot cancel a delivered order' });
          }
        } catch (error) {
          console.log('Error canceling order:', error);
          return res.status(500).json({ success: false, message: 'An error occurred while canceling the order' });
        
        }
}
const orderDetails = async (req, res) => {
    try {
      const user = await Users.findOne({ Email: req.session.email })
      const orderId = req.params.id;
      console.log(orderId);
      const orderData = await order.find({ _id: orderId }).populate('Items.productId');
      console.log(orderData, "*****************************");
  
  
      res.render('user/orderDetails', { orderData, userData:user })
  
    } catch (error) {
      console.error(error)
      res.render('user/404Page')
    }
  }

const oneItemcancel = async (req,res)=>{
    try {
        const { orderId, itemId } = req.body;
        console.log(orderId, "Order ID");
        console.log(itemId, "Item ID");
        const newitemId=itemId.trim()
        const orderData = await order.findById(orderId);
        console.log(orderData, "Order Data");
    
        if (!orderData) {
          return res.status(404).json({ message: 'Order not found' });
        }
        const itemToCancel=null
        orderData.Items.forEach((item,index) => {
          const itemID = item._id.toString()
          if ( itemID == newitemId ) {
            itemToCancel = item;
           
            // console.log('................90234909',item);
          }
        });
        console.log("splice is worked");
        console.log('iuggqreiutg', itemToCancel, "Item to Cancel-------------------------------");
    
        if (!itemToCancel) {
          return res.status(404).json({ message: 'Item not found in the order' });
        }
    
        const product = await productUpload.findById(itemToCancel.productId);
        console.log(product, "Product Data");
    
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        product.AvailableQuantity += itemToCancel.quantity;
        itemToCancel.status = 'Cancelled';
    
        await orderData.save();
        await product.save();
    
        res.status(200).json({ message: 'Item cancelled successfully', item: itemToCancel });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }
};
    

  
module.exports = {
    toCheckout,
    placeOrder,
    success,
    toOrderPage,
    cancelOrder,
    orderDetails,
    oneItemcancel
}
