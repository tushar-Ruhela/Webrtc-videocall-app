const JWT=require("jsonwebtoken");

 
require("dotenv").config();
const secret=process.env.secret;

const createtokenForUser=(user)=>{
    const payload={
      _id:user._id,
      userName:user.username,
      email:user.password,
      password:user.password,
    }

    const token=JWT.sign(payload,secret);

    return token;
}

const  verifyToken=(token)=>{

    const payload=JWT.sign(token,secret);

    return payload;

}

module.exports={
    verifyToken,
    createtokenForUser,
}