const productData = require("../model/productModel")

const filter = async (req, res) => {
    try {

      // console.log(req.query);
     const brands=req.query.brand ?req.query.brand.split(","):[];
     let filterQuery = {};
    if (brands.length > 0) {
      filterQuery.BrandName = { $in: brands };
    }
    const search = req.query.search;
    const sort = parseInt(req.query.sort)||1;
    const page = parseInt(req.query.page)||0;
    const pageSize = 6
    if(search.length>0){
      filterQuery.ProductName = {$regex:search,$options:'i'}
    }
    const totalCount = await productData.countDocuments(filterQuery)
    const totalPages = Math.ceil(totalCount/pageSize)
    console.log(totalPages,"totalpages");
     const data= await productData.find(filterQuery).sort({Price:sort}).skip((page - 1) * pageSize).limit(pageSize).exec();
     res.json({data,totalPages});
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