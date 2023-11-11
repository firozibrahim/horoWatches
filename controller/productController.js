
const productUpload = require("../model/productModel");
const Category = require("../model/category");

const toAddProduct = async (req, res) => {
  const category = await Category.find();
  res.render("./admin/add-product", { title: "Add Products", category });
};

const addProduct = async (req, res) => {
  const productDetails = req.body;
  console.log(productDetails);
  try {
    const allfiles = req?.files;
    const images = req.files;
    let allImage = [];
    for (let i = 0; i < images.length; i++) {
      allImage[i] = images[i].filename;
    }

    images.forEach((value, index) => {
      console.log("images" + index, value);
    });

    const uploaded = await productUpload.create({
      ...productDetails,
      images: allImage,
    });

    if (uploaded) {
      console.log("Product added");
      res.redirect("/admin/toproducts");
    }
  } catch (error) {
    console.log("An error happened");
    throw error;
  }
};

const toEditProduct = async (req, res) => {
  const id = req.params.id;
  console.log("to edit product");
  const category = await Category.find();
  const data = await productUpload.findOne({ _id: id });
  console.log(data);
  res.render("admin/edit-product", { title: "edit product", data, category });
};

const EditProduct = async (req, res) => {
  try {
    // console.log(req.body);
    const productDetails = req.body;
    console.log("tt" + JSON.stringify(req.body));
    console.log(productDetails);
    let id = req.params.id;
    console.log(id);
    let allImages_filename = [];
    let noImage;
    const allImages = req.files;

    const uploaded = await productUpload.updateOne(
      { _id: id },
      {
        $set: {
          ProductName: req.body.ProductName,
          Description: req.body.Description,
          Specification1: req.body.Specification1,
          Specification2: req.body.Specification2,
          Specification3: req.body.Specification3,
          Price: req.body.Price,
          DiscountAmount: req.body.DiscountAmount,
          AvailableQuantity: req.body.AvailableQuantity,
          BrandName: req.body.BrandName,
          Category: req.body.Category,
          Tags: req.body.Tags,
        },
      }
    );
    if (req.files) {
      for (let i = 0; i < 4; i++) {
        if (
          req.files[`productMainImage${i}`] &&
          req.files[`productMainImage${i}`][0]
        ) {
          await productUpload.findByIdAndUpdate(
            id,
            {
              $set: {
                [`images.${i}`]: req.files[`productMainImage${i}`][0].filename,
              },
            },
            {
              new: true,
            }
          );
        }
      }
    }
    // console.log(uploaded);

    if (uploaded) {
      console.log("Product updated");
      console.log("update image : ---------------", req.files);
      res.redirect("/admin/toproducts");
    } else {
      console.log("product not uploaded");
    }
  } catch (error) {
    console.log("An error happened");
    throw error;
  }
};
const searchProduct = async (req, res) => {
  var i = 0;
  const getdata = req.body;
  console.log(getdata);
  let data = await productUpload.find({
    ProductName: { $regex: "^" + getdata.search, $options: "i" },
  });
  console.log(`Search Data ${data} `);
  res.render("./admin/products", { title: "Home", data, i });
};

const deleteProduct = async (req, res) => {
  console.log("This is delete Product");
  const id = req.params.id;
  console.log("Receive request " + id);

  const data = await productUpload.findOne({ _id: id });

  if (!data) {
    return res.status(404).send("Product not found");
  }
  const newStatus = !data.status;
  await productUpload.updateOne({ _id: id }, { $set: { status: newStatus } });

  console.log(
    `product ${data.ProductName} is ${newStatus ? "unBanned" : "Banned"}`
  );
  res.redirect("/admin/toproducts");
};
const toProductList=async (req,res)=>{
    try{
    let data= await productUpload.find()
    res.render('user/product-list',{title:"Products", data})
    }catch{
        console.error(error);
        res.status(500).send("Internet Server Error")
    }
  }
  const productView=async(req,res)=>{
    console.log("dxfgg");
    const id = req.params.id;
    const data= await  productUpload.findOne({_id:id})
    console.log("to product view");
    res.render("user/product-view",{title:data.ProductName,data})
  }

module.exports = {
  deleteProduct,
  toEditProduct,
  EditProduct,
  searchProduct,
  addProduct,
  toAddProduct,
  toProductList,
  productView,
};
