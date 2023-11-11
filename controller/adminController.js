const users = require("../model/usermodel");
const Category = require("../model/category");
const productUpload = require("../model/productModel");

const toEditcategory = (req, res) => {
  res.redirect("./admin/edit-category");
};

const toDashBoard = (req, res) => {
  res.render("./admin/dashboard", { title: "dashboard" });
};

const toProduct = async (req, res) => {
  try {
    const data = await productUpload.find();
    res.render("admin/products", { title: "category", data });
  } catch (error) {
    console.log("An error occurred", error);
    res.status(500).send("Internal Server Error");
  }
};

const signout = async (req, res) => {
  console.log("Signout");
  req.session.destroy();
  res.redirect("/");
};

//------------------------------------------<<<<<<<<<<<USER MANEGEMENT>>>>>>>>>>>>>>>>>-----------------------------------
const UserStatus = async (req, res) => {
  console.log("This is userstatus");
  const id = req.params.id;
  console.log("Receive request " + id);

  const user = await users.findOne({ _id: id });

  if (!user) {
    return res.status(404).send("User not found");
  }
  let newStatus = "";
  if (user.access === "granted") {
    newStatus = "blocked";
  } else if (user.access === "blocked") {
    newStatus = "granted";
  }

  await users.updateOne({ _id: id }, { $set: { access: newStatus } });

  console.log(
    `User ${user.Username} is ${newStatus ? "unblocked" : "blocked"}`
  );
  res.redirect("/admin/customers");
};

const userDataSharing = async (req, res) => {
  const data = await users.find();
  console.log("this is user data sharing area");
  res.render("./admin/customers.ejs", { title: "Customers", userData: data });
};
const userSearch = async (req, res) => {
  var i = 0;
  const getdata = req.body;
  console.log(getdata);
  let userData = await users.find({
    Username: { $regex: "^" + getdata.search, $options: "i" },
  });

  res.render("./admin/customers", { title: "Home", userData, i });
};

//---------------------------------------------------PRODUCT ---------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// const products = async (req, res) => {
//     try {
//         const data = await productUpload.find();
//         res.render('admin/products', { title: 'category', data });
//     } catch (error) {
//         console.log('An error occurred', error);
//         res.status(500).send('Internal Server Error');
//     }
// };

//------------------------------------------------CATEGORY----------------------------------------------------------

const tocategory = async (req, res) => {
  const data = await Category.find();
  res.render("./admin/category", { title: "category", categoryData: data });
};
const toAddCategory = async (req, res) => {
  res.render("./admin/addCategory", { title: "category", err: false });
};

const addCategory = async (req, res) => {
  console.log("add category");
  try {
    // console.log("category add");
    const CategoryName = req.body.categoryName.toLowerCase();
    console.log("Name is " + CategoryName);

    const data = {
      CategoryName: CategoryName,
    };
    const check = await Category.find({ CategoryName });
    if (check.length == 0) {
      const insert = await Category.create(data);

      console.log("Category added");
      res.json({ success: true, message: "category added" });
    } else {
      res.json({ success: false, err: "Catagory Already Exit" });
    }
  } catch (err) {
    console.log("Error found", err);
  }
};

const deleteCatagory = async (req, res) => {
  try {
    // Delete category by ID
    const id = req.params.id;
    const data = await Category.findOne({ _id: id });
    const newStatus = !data.status;
    const deleted = await Category.updateOne(
      { _id: id },
      { $set: { status: newStatus } }
    );
    res.redirect("/admin/category");
  } catch (error) {
    console.log("Error occurred while deleting category");
  }
};

const editCatagory = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const category = await Category.findOne({ _id: id });
    console.log("this Edit catogory");
    res.render("admin/edit-category", {
      category,
      title: `edit ${category.CategoryName}`,
    });
  } catch (error) {
    console.log("an error occured while editing the category");
  }
};

const afterEditCatagory = async (req, res) => {
  const categoryId = req.params.id;
  const newCategoryName = req.body.categoryName;
  console.log(categoryId + "_____________id");
  console.log(newCategoryName + "_________________");
  try {
    // Check if the edited category name already exists
    const existingCategory = await Category.findOne({
      CategoryName: newCategoryName,
    });

    if (existingCategory) {
      // Category with the same name already exist
      res.json({ success: false, err: "Category already exists" });
    } else {
      // Update the category name in the database
      await Category.updateOne(
        { _id: categoryId },
        {
          $set: {
            CategoryName: newCategoryName,
          },
        }
      );

      res.json({ success: true });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, err: "Failed to update the category name." });
  }
};

module.exports = {
  toProduct,
  UserStatus,
  userDataSharing,
  toAddCategory,
  addCategory,
  tocategory,
  userSearch,
  signout,
  deleteCatagory,
  editCatagory,
  afterEditCatagory,
  toEditcategory,
  toDashBoard,
  toProduct,
};
