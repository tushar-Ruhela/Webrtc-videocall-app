const express=require("express");
const router=express.Router();
const User=require("../models/user");
const JWT=require("jsonwebtoken");

const JWT_SECRET = process.env.secret || "mySuperSecretKey"; 
const JWT_SECRET_REFRESH=process.env.refresh || "mySuperRefreshKey";




router.post("/refresh",async(req,res)=>{
    try{
        const {refreshToken}=req.body;
        if(!refreshToken){
            return res.status(401).json({error:"Refresh Token is required"});
        }

        const user=await User.findOne({refreshToken});
        if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }
    JWT.verify(refreshToken,JWT_SECRET_REFRESH,(err,decoded)=>{
        if(err){
         return res.status(403).json({error:"Expired or invalid refresh token"});
        }
        const newAccessToken= JWT.sign(
           {id:user._id,username:user.userName,email:user.email},
           refreshToken,
           {expiresIn:"1h"}
        );

        return res.json({accessToken:newAccessToken})
    });
    }catch(error){
        console.log("Refresh Token Error",error);

        res.status(500).json({error:"Internal Server Error"});

    }
})

module.exports=router;