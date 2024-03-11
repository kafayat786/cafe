const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// API route for user login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(username, "ssv");
    // Find the user by name
    const user = await User.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if the email is already registered
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User Name is already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user using the User model
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    res.status(201).json({ message: "Signup successful", user: savedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
