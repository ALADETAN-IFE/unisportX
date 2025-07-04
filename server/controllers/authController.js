const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require("../utils/tokenGeneration")

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
      return res.status(400).json({ message: 'fill all fields' });
    }
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'The email already exists' });
    }

    user = new User({
      username,
      email,
      password,
    });

    
    generateToken(user, res)
    
    await user.save();

    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(201).json({ message: 'User registered successfully', data: userWithoutPassword });
  } catch (err) {
    console.error(err.message);
    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      return res.status(400).json({ 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} "${value}" is already taken. Please choose a different ${field}.` 
      });
    }
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const payload = username ? { username } : { email };
    if (!payload.username && !payload.email) {
      return res.status(400).json({ message: 'Username or email is required' });
    }
    const user = await User.findOne(payload);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

   generateToken(user, res)

    const { password: _, ...userWithoutPassword } = user._doc;
    res.status(200).json({ message: 'User logged in successfully', data: userWithoutPassword });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
}; 

exports.logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.json({ success: true, msg: 'Logged out successfully' });
};