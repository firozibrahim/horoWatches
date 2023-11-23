const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
  BrandName: {
    type: String,
    required: true,
    unique: true,
  },
  time:{type:Date},
  status:{type:Boolean,default:true}
});

const Brand = mongoose.model("brand", BrandSchema);

module.exports = Brand;