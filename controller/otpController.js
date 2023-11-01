const OTP=require("../model/otpModel");
const generateOTP =require("../utils/generateOtp")
const sendEmail=require("../utils/mail")
const bcrypt = require("bcrypt")
const {AUTH_EMAIL}=process.env;
const hashData=require("../utils/hashData")

const sendOTP= async(email)=>{
    try{
        if(!(email)){
            throw Error("provide values for email,subject,message")
        }
        //clear old otp
        // console.log(email);
        await OTP.deleteOne({email})
        console.log("delete OTP and new OTP send")

        //generate new otp
        const generatedOTP=await generateOTP()

        //sending email to the user
        const mailOptions={
            from:AUTH_EMAIL,
            to:email,
            subject:"verify the Email using this otp",
            html:`<p>Hello new user use this otp to verify your email to continue </p><b>${generatedOTP}</b><p>OTP will expire in 10 minutes</p>`
        }
        await sendEmail(mailOptions)

        //save otp record

        function addminutestoDate(date,minutes){
            return new Date(date.getTime()+minutes*60000);
        }
        const currentDate=new Date();
        const newDate= addminutestoDate(currentDate,10)
        const newOTP= await new OTP({
            email,
            otp:generatedOTP,
            CreatedAt:Date.now(),
            expireAt:newDate,
        })
        const createdOTPrecord= await newOTP.save()
        return createdOTPrecord
    }catch(err){
        throw err;
    }
}
module.exports=sendOTP;