const users = require("../model/usermodel");

const verifyUser =async (req,res,next)=>{

    // console.log("check auth ",email,user,"user..");
    if(req.session.logged){

            next();
    }else{
        res.redirect("/")
    }
};

const userExist = async (req,res,next)=>{
    if(req.session.logged){
        
        res.redirect("/user/home");
    }else{
        next();
    }
};


module.exports={
    verifyUser,
    userExist,
}