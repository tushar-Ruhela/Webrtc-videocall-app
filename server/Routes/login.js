const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const User=require("../models/user");

const JWT=require("jsonwebtoken");


const JWT_SECRET = process.env.secret || "mySuperSecretKey"; 
const JWT_SECRET_REFRESH=process.env.refresh || "mySuperRefreshKey";



router.post("/login",async(req,res)=>{
try{
const {email,password}=req.body;

if(!email || !password){
    return res.status(400).json({error:"Email or password is required"});
}

const existingUser= await User.findOne({email});

if(!existingUser){
    return res.status(400).json({error:"Invailed email"});
}

const isMatch= await bcrypt.compare(password,existingUser.password);

if(!isMatch){
    return res.status(400).json({error:"Invailed password"});
}

const access_token = JWT.sign(
      {
        id: existingUser._id,
        username: existingUser.userName,
        email: existingUser.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refresh_token = JWT.sign(
      {
        id: existingUser._id,

      },
      JWT_SECRET_REFRESH,
      { expiresIn: "7d" }
    );


    existingUser.refreshToken=refresh_token;
    return res.status(200).json({
      message: "Login successful",
      access_token,
      refresh_token,
      user: {
        username: existingUser.userName,
        email: existingUser.email,
      },
    });
}catch(error){
     console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });

}







})

module.exports=router;