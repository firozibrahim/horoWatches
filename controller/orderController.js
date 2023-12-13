const cart = require("../model/cartModel");
const Users = require("../model/usermodel");
const order = require("../model/orderModel");
const productUpload = require("../model/productModel");
const Return = require("../model/return");
const razorpay = require("../service/razorpay");
const {generateId} = require("../utils/orderid")
const {createHmac} = require("crypto");
const { default: mongoose } = require("mongoose");
require("dotenv").config()


const toCheckout = async (req, res) => {
  console.log("to checkout page");
  const email = req.session.email;
  const TotalPrice = req.session.totalPrice;
  const grandTotal = req.session.grandTotal;
  console.log("email:", email, "total:", TotalPrice, "grand:", grandTotal);

  const userData = await Users.findOne({ Email: email });

  const Cart = await cart.findOne({ userId: userData._id });
  const coupon = req.session.coupon;
  res.render("user/checkoutPage", {
    title: "checkout  page",
    userData,
    user: userData,
    Cart,
    TotalPrice,
    coupon,
    grandTotal,
  });
};
const placeOrder = async (req, res) => {
  try {
    const userData = await Users.findOne({ Email: req.session.email });
    const userId = userData._id;
    const selectedAddressId = req.body.selectedAddress;
    const paymentMethod = req.body.selectedPaymentMethod;
    console.log("d>>>>>>>>>>>>>>>>>>>>>>>>>", selectedAddressId);
    const amount = req.session.totalPrice;
    console.log(amount);
    const amountInRupees = Math.floor(amount);

    const amountInPaisa = Math.round(amountInRupees * 100);
    console.log(amountInPaisa, "...........", amountInRupees);
    const selectedAddress = userData.Address.find(
      (address) => address._id == selectedAddressId
    );
    console.log("..................", selectedAddress);
    if (!selectedAddress) {
      return res
        .status(400)
        .json({ success: false, message: "Selected address not found" });
    }

    const cartDetails = await cart.findOne({ userId: userId });
    const orderId = generateId()
    console.log(orderId)
    const newOrder = new order({
      Status: "Pending",
      Items: cartDetails.products,
      UserID: userId,
      paymentMethod: paymentMethod,
      Address: {
        name: selectedAddress.name,
        addressLine: selectedAddress.addressLine,
        city: selectedAddress.city,
        pincode: selectedAddress.pinCode,
        state: selectedAddress.state,
        mobileNumber: selectedAddress.MobileNumber,
      },
      TotalPrice: req.session.totalPrice,
      OrderDate: new Date(),
      orderId:orderId,
      
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
    console.log("payment method:", paymentMethod);
    if (paymentMethod === "cod") {
      res.json({
        cod: true,
        message: "order Success",
      });
    } else if (paymentMethod === "online") {
      
      const order = {
        amount: amountInPaisa,
        currency: "INR",
        receipt: savedOrder._id,
      };

     await razorpay(order)
        .then((createdOrder) => {
          console.log(createdOrder);
          res.json({
            online: true,
            createdOrder,order,
          });
        })
        .catch((err) => {
          console.log(err);
        });

    }
  } catch (error) {
    console.error("Error placing the order:", error);
    return res.render("user/404Page");
  }
};

const success = (req, res) => {
  res.render("user/orderSuccess");
};
const toOrderPage = async (req, res) => {
  try {
    const userData = await Users.findOne({ Email: req.session.email });
    const userId = userData._id;
    // console.log(userId, '.............');

    const orderData = await order
      .find({ UserID: userId })
      .populate("Items.productId")
      .sort({ OrderDate: -1 });

    // console.log(orderData, "..................................");

    res.render("user/Orders", { title: "Orders", orderData, userData });
  } catch (error) {
    console.log(error);
    res.render("user/404Page");
  }
};
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderData = await order.findById(orderId);

    if (orderData.Status !== "Delivered") {
      orderData.Status = "Cancelled";
      if (
        orderData.paymentMethod === "online" ||
        orderData.paymentMethod === "wallet"
      ) {
        const userData = await Users.findOne({ Email: req.session.email });

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

      return res.json({ success: true, message: "Order has been canceled" });
    } else {
      return res.json({
        success: false,
        message: "Cannot cancel a delivered order",
      });
    }
  } catch (error) {
    console.log("Error canceling order:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while canceling the order",
    });
  }
};
const orderDetails = async (req, res) => {
  try {
    const user = await Users.findOne({ Email: req.session.email });
    const orderId = req.params.id;
    // console.log(orderId);
    const orderData = await order
      .find({ _id: orderId })
      .populate("Items.productId");
    console.log("*****************************",orderData);

    res.render("user/orderDetails", { orderData, userData: user });
  } catch (error) {
    console.log(error);
    res.render("user/404Page");
  }
};

const oneItemcancel = async (req, res) => {
  try {
    const { orderId, itemId } = req.body;
    const newitemId = itemId.trim();
    const orderData = await order.findById(orderId);


    if (!orderData) {
      return res.status(404).json({ message: "Order not found" });
    }
    let itemToCancel = null;
    orderData.Items.forEach((item, index) => {
      const itemID = item._id.toString();
      if (itemID == newitemId) {
        itemToCancel = item;
      }
    });
    console.log("splice is worked");
    console.log(
      "iuggqreiutg",
      itemToCancel,
      "Item to Cancel-------------------------------"
    );

    if (!itemToCancel) {
      return res.status(404).json({ message: "Item not found in the order" });
    }

    const product = await productUpload.findById(itemToCancel.productId);
    console.log(product, "Product Data");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
// console.log(product.DiscountAmount*product.);
    orderData.TotalPrice -= parseInt(product.DiscountAmount * itemToCancel.quantity);
    product.AvailableQuantity += itemToCancel.quantity;
    itemToCancel.status = "Cancelled";

    const allItemsCancelled = orderData.Items.every(item => item.status === 'Cancelled');

    if (allItemsCancelled) {
      orderData.Status = 'Cancelled';
    }

    await orderData.save();
    await product.save();

    res
      .status(200)
      .json({status:true, message: "Item cancelled successfully", item: itemToCancel });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const returnOrder = async (req, res) => {
  try {
    const { orderId, itemId, returnReason, returnDescription } = req.body;
    const newitemId = itemId.trim();
    const orderData = await order.findById(orderId);

    if (!orderData) {
      return res.status(404).json({ message: "order not fonud" });
    }
    let itemReturn = null;
    let itemIndex = -1;

    orderData.Items.forEach((item, index) => {
      const itemID = item._id.toString();
      if (itemID === newitemId) {
        itemReturn = item;
        itemIndex = index;
      }
    });
    if (!itemReturn || itemIndex === -1) {
      return res.status(404).json({ message: "item not found" });
    }
    orderData.Items[itemIndex].status = "Return";
    const returnQuantity = itemReturn.quantity;

    await orderData.save();

    const product = await productUpload.findById(itemReturn.productId);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    const user = await Users.findOne({ Email: req.session.email });
    const userId = user._id;
    const productId = product.id;
    const price = product.DiscountAmount * returnQuantity;

    const returnDate = new Date();
    const orderDate = orderData.OrderDate;
    const returnData = new Return({
      userId,
      orderId,
      product: productId,
      reason: returnReason,
      quantity: returnQuantity,
      price,
      returnDate,
      orderDate,
    });
    await returnData.save();
    return res
      .status(200)
      .json({ success: true, message: "product return successfull" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, messge: "internal server error" });
  }
};
const verifyPayment = async(req,res)=>{
try {
  const hmac = createHmac("sha256",process.env.KEY_SECRET)
  const {payment,orderDetails} =req.body;

  const orderId = orderDetails.createdOrder.receipt;
  const updatedDocument = await order.findByIdAndUpdate(orderId,{
    paymentMethod:"online",
    paymentStatus:"paid",
  })
  res.json({success:true})
  hmac.update(payment.razorpay_order_id+"|"+payment.razorpay_payment_id)
  hmac = hmac.digest("hex")
  if(hmac===payment.razorpay_signature){
    const orderId = new mongoose.Types.ObjectId(
      orderDetails.createdOrder.receipt
    );

  }else{
    res.json({failure:true})
  }
} catch (error) {
  console.log(error);
}
}

module.exports = {
  toCheckout,
  placeOrder,
  success,
  toOrderPage,
  cancelOrder,
  orderDetails,
  oneItemcancel,
  returnOrder,
  verifyPayment,
};
