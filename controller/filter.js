const productData = require("../model/productModel")

const filter = async (req, res) => {
    try {
     const brands=req.query.brand ?req.query.brand.split(","):[];
     let filterQuery = {};
    if (brands.length > 0) {
      filterQuery.BrandName = { $in: brands };
    }
    //  const categories = req.query.category ? req.query.category.split(",") : [];
     const data= await productData.find(filterQuery).exec();
     res.json({data});
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