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
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
    });

    
    generateToken(user, res)
    
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
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
    let user = await User.findOne(payload);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

   generateToken(user, res)

    res.status(200).json({ message: 'User logged in successfully', data: user });
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