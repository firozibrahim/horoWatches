const productData = require("../model/productModel")

const filter = async (req, res) => {
    try {
     const brand=req.params.brand
     const data= await productData.find({BrandName:brand}).exec();
     res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  
  const allproduct=async (req,res)=>{
    try {
      const data = await productData.find()
      res.json(data)
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  
  module.exports = {
      filter,
      allproduct,
      
  };