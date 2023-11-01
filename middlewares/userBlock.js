const user=require("../model/usermodel")

const checkBlock= async(req,res,next)=>{
    console.log(req.session.email);
    const check=await user.findOne({Email:req.session.email})
    console.log(check);
    console.log("user block checking",check);
    if(check.access=="blocked"){
        console.log("user block done cannot access...........");
        req.session.destroy((err)=>{
            res.redirect('/')
        })
    }else{
        next()
    }

}
module.exports=checkBlock;