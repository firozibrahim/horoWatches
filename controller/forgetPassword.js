// const sendOTP = require("./otpController")
// const OTP = require("../model/otpModel")
// const productUpload= require("../model/productModel")
const Users= require("../model/usermodel")
// const Cart= require("../model/usermodel")
const bcrypt = require("bcrypt")



const changePass = async (req, res) => {
    try {
      const check = await Users.findOne({ Email: req.session.email});
      console.log("User check:", check);

      if (check) {
        console.log(req.body.oldPassword,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        const isMatch = await bcrypt.compare(req.body.oldPassword, check.Password);
        console.log("Password Match:", isMatch);

        if (isMatch) {
            const pass = await bcrypt.hash(req.body.newPassword, 10);
            const email = req.session.email;
            console.log("New Password:", req.body.newPassword);
            console.log("Email:", email);

            const update = await Users.updateOne({ Email: email }, { $set: { password: pass } });
            console.log("Update Result:", update);

            return res.json({ success: true });
          }else{
            console.log("else");
              return res.json({ success:false, error: "Wrong password" });

          }
        } else {
            // console.log("else");
          return res.json({ success:false, error: "Invalid password" });
        }
    } catch (error) {
      console.error("Error:", error);
      return res.json({ success: false, error: "Invalid password" });
    }
};

  
module.exports={
    changePass,

}