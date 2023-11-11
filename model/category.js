const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  CategoryName: {
    type: String,
    required: true,
    unique: true,
  },
  time:{type:Date},
  status:{type:Boolean,default:true}
});

const Category = mongoose.model("Categories", CategorySchema);

module.exports = Category;