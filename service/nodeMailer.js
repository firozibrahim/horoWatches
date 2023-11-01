const nodeMailer=require("nodemailer")
require('dotenv').config()

module.exports={
    sendOTP:(OTP,Email)=>{
        console.log(Email);
        const transporter=nodeMailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.AUTH_EMAIL,
                pass:process.env.AUTH_PASS,
            }
        })
    }
}