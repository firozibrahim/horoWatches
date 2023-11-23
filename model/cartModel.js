const mongoose = require("mongoose");

const cart = new mongoose.Schema({
   userId:{type:mongoose.Schema.Types.ObjectId} ,
    products:[{
        productId:{type:mongoose.Schema.Types.ObjectId,ref:'productUpload'},
        quantity:{type:Number},
        Price:{type:Number},
    }],
    TotalAmount :{type:Number}
});

cart.methods.calculateTotalQuantity = function(){
    let totalQuantity= 0;
    this.products.forEach(item=>{
        totalQuantity+=item.quantity;
    })
    return totalQuantity;
}

const Cart = mongoose.model("Cart",cart);
module.exports=Cart;