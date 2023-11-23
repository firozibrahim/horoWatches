const User = require("../model/usermodel");
const OTP = require("../model/otpModel");
const Admin = require("../model/adminModel");
const sendOTP = require("./otpController");
const productUpload=require("../model/productModel")
const { hashData, verifyHashedData } = require("../utils/hashData");
// const Users = require("../model/usermodel");

const home = async (req, res) => {
  const email= req.session.email
  const user=await User.findOne({Email:email})
  const product=await productUpload.find()
  if (req.session.logged&&user.access==="granted") {
    res.render("./user/user-home",{product});
  } else if (req.session.adminlogged) {
    res.redirect("/admin");
  } else {
    res.render("./user/landingPage", {title:home,product });
  }
};

const tologin = (req, res) => {
  if (req.session.logged) {
    res.redirect("/user/home");
  } else if (req.session.adminlogged) {
    res.redirect("/admin");
  } else {
    res.render("./user/login");
  }
};
const login = async (req, res) => {
  try {
    const emailToFind = req.body.email;
    const user = await User.findOne({ Email: emailToFind });
    const admin = await Admin.findOne({ Email: emailToFind });

    if (!user) {
      if (admin) {
        // console.log(req.body.password,admin.Password);
        if (req.body.password === admin.Password) {
          req.session.admin = admin.Username;
          req.session.adminlogged = true;
          req.session.email = admin.Email;
          return res.json({ success: true, adminAuth: true });
        } else {
          return res.json({
            success: false,
            error: "wrong password for admin",
          });
        }
      }
      return res.json({ success: false, error: "user not found" });
    } else {
      if (await verifyHashedData(req.body.password, user.Password)) {
        if (user.access==="granted") {
          req.session.user = user.Username;
          req.session.logged = true;
          req.session.email = user.Email;
          console.log();
          return res.json({ success: true, userAuth: true });
        } else {
          return res.json({ success: false, error: "user is blocked" });
        }
      } else {
        return res.json({ success: false, error: "invalid password" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, error: "invalid username or password" });
  }
};
const resendotp = async (req,res)=>{
  try{
    const email=req.session.email;
    const createOTP = await sendOTP(email)
    res.redirect("/user/otp")
  }catch(err){
    console.log(err)
    console.log("cant resend otp now");
  }
}

const tosignUp = (req, res) => {
  if (req.session.logged) {
    res.redirect("/user/home");
  } else if (req.session.adminlogged) {
    res.redirect("/admin");
  } else {
    res.render("./user/signUp", { err: false });
  }
};
const signUp = async (req, res) => {
  // console.log(req.body);
  try {
    let emailToFind = req.body.email;
    // console.log("emailto find",emailToFind);
    let emailExists = await User.findOne({ Email: emailToFind });
    if (emailExists) {
      res.json({ success: false, message: "USER ALREADY EXIST" });
    } else {
      console.log(req.body.password);
      const hashedPassword = await hashData(req.body.password, 10);
      // console.log(hashedPassword);
      const data = {
        Username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      };
      req.session.data = data;
      req.session.email = data.email;
      req.session.signotp = true;
      req.session.user = data.userName;

      res.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: false, error: "error" });
  }
};
const otpSender = async (req, res) => {
  if (req.session.signotp || req.session.forgot) {
    try {
      //console.log(req.session.email)
      //console.log("otp route")
      const email = req.session.email;
      const createdOTP = await sendOTP(email);
      req.session.email = email;
      console.log("session before verifying otp:", req.session.email);
      res.redirect("/user/otp");
    } catch (err) {
      console.log(err);
      req.session.err = "sorry we cant send otp at this moment";
      if (req.session.forgot) {
        res.redirect("user/forgotPassword");
      }
      res.redirect("signUp");
    }
  }
};
const otp = (req, res) => {
  res.render("user/otpPage", { err: false });
};
const validateOtp = async (req, res) => {
  // console.log(req.session.userdata);
  if (req.session.forgot) {
    try {
      const data = req.session.userdata;
      // console.log("jjj",data);
      console.log("forgot confirmation:", data.email);
      const otp = await OTP.findOne({ email: data.email });
      console.log(otp);
      if (Date.now() > otp.expireAt) {
        console.log("reached at delete otp");
        await OTP.deleteOne({ email: data.email });
      } else {
        const hashed = otp.otp;
        console.log("reached hashed");
        const code = req.body.otp;
        console.log(`hash:${hashed},otp:${code}`);
        if (hashed === code) {
          req.session.forgot = false;
          res.json({ status: true });
        } else {
          console.log("invalid otp");
          req.session.err = "invalid otp";
          res.json({ status: false, err: "invalid OTP" });
        }
      }
    } catch (err) {
      console.log(err);
      req.session.errmsg = "email not found";
    }
  } else if (req.session.signotp) {
    try {
      const data = req.session.data;
      console.log(data);
      const otp = await OTP.findOne({ email: data.email });
      if (Date.now() > otp.expireAt) {
        await OTP.deleteOne({ email: data.email });
      } else {
        const hashed = otp.otp;
        // console.log("hashed:", hashed);
        const code = req.body.otp;
        console.log(code);
        // console.log(data);
        req.session.email = data.email;

        if (hashed == code) {
          // console.log(data);
          const newUser = new User({
            Username: data.Username,
            Email: data.email,
            Password: data.password,
            access: "granted",
            Role: "User",
          });
          await newUser.save();
          req.session.email=newUser.Email;
          req.session.logged = true;
          req.session.signotp = false;
          res.json({ status: true, route: "/user/home" });
        } else {
          req.session.err = "invalid otp";
          res.json({ status: false, error: "invalid otp" });
        }
      }
    } catch (err) {
      console.log(err);
      req.session.errmsg = "email not found";
    }
  }
};
const toForgotPass = (req, res) => {
  req.session.forgot = true;
  res.render("user/forget-pass");
};
const forgotPass = async (req, res) => {
  try {
    console.log(req.body);
    const check = await User.findOne({ Email: req.body.email });
    console.log(check);

    if (check) {
      req.session.email = check.Email;
      console.log("good to go:", check);
      const userdata = {
        email: check.Email,
        userName: check.Username,
        _id: check._id,
      };
      const email = req.body.email;
      console.log("Email::: ", email);
      req.session.userdata = userdata;
      req.session.email = email;
      console.log("Sessiosiiii: ", req.session.email);
      console.log(req.session.userdata);
      res.json({ success: true });
    } else {
      console.log(check);
      req.session.err = "no email found";
      res.json({ success: false, message: "email not found" });
    }
  } catch (err) {
    console.log(err);
    req.session.err = "no email found";
    res.json({ success: false, message: "something wrong" });
  }
};

const toNewpassword = async (req, res) => {
  res.render("user/new-password");
};
const passwordReset = async (req, res) => {

console.log("reached");
  try {
    console.log("this is forget pass reset");
    console.log(req.body);
    console.log("session........", req.session.email);
    const pass =await hashData(req.body.password, 10);
    console.log(pass);
    const email = req.session.email;
    console.log(email);
    const update = await User.updateOne(
      { Email: email },
      { $set: { Password: pass } }
    );
    // console.log(update);
    req.session.logged = true;
    // req.session.pass_reset = false
    res.json({success:true});
  } catch (err) {
    console.log(err);
  }
};
const userData = async (req,res)=>{
  const email=req.session.email;
  const userData = await User.findOne({Email:email})
  console.log(userData);
  res.render("user/profile",{userData})
}
const addAddress = async (req,res)=>{
  try{
    const email = req.session.email;
    console.log(req.body);
    let newAddress = {
      name:req.body.name,
      addressLine:req.body.address,
      city:req.body.city,
      pinCode:req.body.pincode,
      state:req.body.state,
      MobileNumber:req.body.number,
    }
    const user = await User.findOne({Email:email})
    user.Address.push(newAddress)
    await user.save();
    res.json({success:true})

  }catch(err){
    console.log(err);
  }
}
const toManageAddress  = async (req,res)=>{
  try{
    const email = req.session.email;
    const userData = await User.findOne({Email:email})
    res.render("user/addressManage",{userData,user:userData})
  }catch(error){
    console.log(error);
  }
}
const editAddress = async(req,res)=>{
  try {
    const addresssId = req.params.id;
    const updatedAdress ={
      name:req.body.name,
      addressLine:req.body.address,
      city:req.body.city,
      pinCode:req.body.pincode,
      state:req.body.state,
      MobileNumber:req.body.number,
    }
    const user = await User.findOneAndUpdate(
      {'Address._id':addresssId},
      {$set:{'Address.$': updatedAdress}},
      {new:true},
    )
    if(user){
      res.redirect("/user/toManageAddress")
    }
  } catch (error) {
    console.log("error editing address",error);
  }
}
const deleteAddress = async(req,res)=>{
  try {
    const email = req.session.email;
    const adressId = req.params.id;
    const user = await User.findOne({Email:email})
    if(!user){
      return res.status(404).json({message:"user not found"})
    }
    const addressIndex = user.Address.findIndex((address)=>address._id.toString()===adressId);
      if(addressIndex === -1){
        return res.status(404).json({message:"Adress not found"})
      }
      user.Address.splice(addressIndex,1)
      await user.save();
      res.status(200).json({success:true, message:"address deleted successfully"})
  } catch (error) {
    console.log("error deleting address",error);
  } 
}
const toAccountSettings= (req,res)=>{
  try {
      res.render('user/account-setting',{title:"account Settings"})
  } catch (error) {
      res.render('user/404Page')
  }
}
const userProfile= async (req, res) => {
  try{
      console.log("user Profile section");
      if (req.file) {
          const updatedUser = await User.findOneAndUpdate(
              { Email: req.session.email },
              { profilePhoto: req.file.filename },
              { new: true }
          );

          if (updatedUser) {
              console.log("updated");
              res.status(200).json({ message: 'Profile photo updated successfully' });
          } else {
              res.status(404).json({ error: 'User not found' });
          }
      } else {
          res.status(400).json({ error: 'No file was uploaded' });
      
  }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/tologin");
};
module.exports = {
  home,
  tologin,
  tosignUp,
  signUp,
  otpSender,
  otp,
  validateOtp,
  login,
  logout,
  toForgotPass,
  forgotPass,
  passwordReset,
  userData,
  toNewpassword,
  resendotp,
  toManageAddress,
  addAddress,
  deleteAddress,
  editAddress,
  toAccountSettings,
  userProfile,
};
