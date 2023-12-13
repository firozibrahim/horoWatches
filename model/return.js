const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  orderId: { type: mongoose.Schema.Types.ObjectId },
  Status: { type: String, default: "NotVerified" },
  product: { type: mongoose.Schema.Types.ObjectId },
  quantity: { type: Number },
  reason: { type: String },
  price: { type: Number },
  returnDate: { type: Date },
  orderDate: { type: Date },
});
const Return = mongoose.model("return", returnSchema);
module.exports = Return;
