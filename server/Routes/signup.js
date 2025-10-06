const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

  
    const newUser = new User({
      userName: username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log("User created:", username, email);

   
    return res.status(201).json({
      message: "User created successfully",
      user: { username, email },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
