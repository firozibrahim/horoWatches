const User = require("../model/usermodel");
const OTP = require("../model/otpModel");
const sendOTP = require("./otpController");
const {hashData,verifyHashedData}=require("../utils/hashData")

const home = async (req, res) => {
  if (req.session.logged) {
    res.redirect("/user/home");
  } else {
    // const data = await productUpload.find()
    res.render("./user/landingPage", { err: false });
  }
};

const tologin = (req, res) => {
  res.render("./user/login");
};
const userLogin = async (req, res) => {
  try {
    const emailToFind = req.body.email;
    console.log("email", emailToFind);
    const user = await User.findOne({ Email: emailToFind });
    if (!user) {
      return res.json({ success: false, error: "user not found" });
    } else {
      if (verifyHashedData(req.body.password, user.Password)) {
        if (user.access) {
          req.session.user = user.Username;
          req.session.logged = true;
          req.session.email = user.Email;
          return res.json({ success: true });
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
const tosignUp = (req, res) => {
  if (req.session.logged) {
    res.redirect("/user/home");
  } else {
    res.render("./user/signUp", { err: false });
  }
};
const signUp = async (req, res) => {
  let emailToFind = req.body.email;
  console.log(emailToFind);
  let emailExists = await User.findOne({ Email: emailToFind });
  if (emailExists) {
    res.json({success:false,message:"USER ALREADY EXIST"})
  } else {
    // console.log(typeof(req.body.password))
    const hashedPassword =hashData(req.body.password, 10);
    const data = {
      userName: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };
    req.session.data = data;
    req.session.email = data.email;
    req.session.signotp = true;

    res.json({success:true})
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
  // console.log(req.body);
  console.log(req.session.signotp);
  if (req.session.forgot) {
    try {
      const email = req.session.email;
      console.log("forgot confirmation:", email);
      const otp = await OTP.findOne({ email: email });
      if (Date.now() > otp.expiredAt) {
        await OTP.deleteOne({});
      } else {
        const hashed = otp.otp;
        const { code, email } = req.body;
        if (hashed === code) {
          req.session.forgot = false;
          res.render("user/newPassword");
        } else {
          req.session.userdata = "";
          req.session.err = "invalid otp";
          res.render("user/otpPage", { err: "invalid OTP" });
        }
      }
    } catch (err) {
      console.log(err);
      req.session.errmsg = "email not found";
    }
  } else if (req.session.signotp) {
    try {
      const data = req.session.data;
      // console.log(data)
      const otp = await OTP.findOne({ email: data.email });
      if (Date.now() > otp.expiredAt) {
        await OTP.deleteOne({ email: data.email });
      } else {
        const hashed = otp.otp;
        console.log("hashed:", hashed);
        const code = req.body.otp;
        console.log(code);
        req.session.email = data.email;
        if (hashed == code) {
          console.log(data);
          const newUser = new User({
            Username: data.userName,
            Email: data.email,
            Password: data.password,
            access: "granted",
            Role: "User",
          });
          await newUser.save();
          req.session.logged = true;
          req.session.signotp = false;
          res.json({ status: true });
        } else {
          req.session.err = "invalid otp";
          res.render("user/otpPage", { err: "invalid otp" });
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
  res.render("./user/forget-pass");
};
const forgotPass = async (req, res) => {
  try {
    console.log(req.body);
    const check = await User.findOne({ Email: req.body.email });
    req.session.email = check.Email;

    if (check) {
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
      res.redirect("/user/toOtp");
    } else {
      console.log(check);
      req.session.err = "no email found";
      res.redirect("/user/forget-pass");
    }
  } catch (err) {
    console.log(err);
    req.session.err = "no email found";
    res.redirect("/user/forget-pass");
  }
};
const passwordReset = async (req, res) => {
  try {
    console.log("this is forget pass reset");
    console.log(req.body);
    console.log("session........", req.session.email);
    const pass = hashData(req.body.password, 10);
    const email = req.session.email;
    console.log(email);
    const update = await User.updateOne(
      { Email: email },
      { $set: { password: pass } }
    );
    req.session.logged = true;
    // req.session.pass_reset = false
    res.redirect("/user/indexToLogin");
  } catch (err) {
    req.flash("errmsg", "something went wrong");
    console.log(err);
  }
};
const userLog = async (req, res) => {
  if (req.session.logged || req.user) {
    const user = req.session.user;
    console.log(user);
    console.log(req.session.logged);
    // const data = await productUpload.find();
    res.render("user/user-home", { title: "Home", user });
  } else {
    console.log("login");
    res.redirect("/");
  }
};
const logout = (req, res) => {
  req.session.destroy();
  res.json({ status: true });
};
module.exports = {
  home,
  tologin,
  tosignUp,
  signUp,
  otpSender,
  otp,
  validateOtp,
  userLogin,
  logout,
  toForgotPass,
  forgotPass,
  passwordReset,
  userLog,
};
