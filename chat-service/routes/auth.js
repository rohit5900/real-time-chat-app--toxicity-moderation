const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

// In-memory fallback
const localUsers = [];

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (isMongoConnected()) {
      // MongoDB Logic
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = new User({ username, email, passwordHash });
      await newUser.save();
    } else {
      // In-Memory Logic
      const existingUser = localUsers.find(u => u.email === email || u.username === username);
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = {
        _id: Date.now().toString(),
        username,
        email,
        passwordHash,
        createdAt: new Date()
      };
      localUsers.push(newUser);
    }

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;

    if (isMongoConnected()) {
       user = await User.findOne({ email });
    } else {
       user = localUsers.find(u => u.email === email);
    }

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create Token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({ token, username: user.username, userId: user._id });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
