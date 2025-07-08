const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utils/tokenGeneration")
const crypto = require('crypto');
const { sendWelcomeEmail, sendPasswordResetEmail, sendVerificationEmail } = require('../lib/mail');
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.CLIENT_ID);

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
    if (user) {
      return res.status(400).json({ message: 'The email already exists' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

    user = new User({
      username: username.toLowerCase(),
      email,
      password,
      verificationToken,
      verificationTokenExpires,
      isVerified: false
    });

    
    // generateToken(user, res)
    
    await user.save();

    const { password: _, ...userWithoutPassword } = user._doc;

    // Send verification email (non-blocking)
    sendVerificationEmail(email, verificationToken, username).catch(err => {
      console.error('Failed to send verification email:', err);
    });

    res.status(201).json({ 
      message: 'User registered successfully. Please check your email to verify your account.', 
      data: userWithoutPassword 
    });
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
    const payload = username ? { username: username.toLowerCase() } : { email: email.toLowerCase() };
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

    if(user.isVerified == false){
      return res.status(401).json({ 
        message: 'Please verify your email address before logging in. Check your inbox for the verification link.',
        needsVerification: true,
        email: user.email
      });
    }

   generateToken(user, res)

    const { password: _, ...userWithoutPassword } = user._doc;
        
    res.status(200).json({ message: 'User logged in successfully', data: userWithoutPassword });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
}; 

exports.googleAuth = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is required' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });
    let existingName = await User.findOne({ username: name });

    if (!user) {
      // Create new user
      const username = existingName ? name.toLowerCase().replace(/\s+/g, '') : name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
      console.log("name", name)
      console.log("existingName", existingName)
      user = new User({
        username,
        email,
        googleId,
        profilePicture: picture,
        isVerified: true, // Google users are pre-verified
        password: crypto.randomBytes(32).toString('hex') // Random password for Google users
      });

      await user.save();
    } else {
      // Update existing user with Google ID if not present
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        if (picture && !user.profilePicture) {
          user.profilePicture = picture;
        }
        await user.save();
      }
    }

    // Generate JWT token and set cookie
    generateToken(user, res);

    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      data: userWithoutPassword
    });

  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid Google token or authentication failed' 
    });
  }
};

exports.check = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // res.status(200).json({ authenticated: true, user: decoded.user });
    res.status(200).json({ authenticated: true});
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
}

exports.logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.json({ success: true, msg: 'Logged out successfully' });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(200).json({ message: 'If your email is in our system, you will receive a reset link' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send password reset email
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    
    const emailSent = await sendPasswordResetEmail(email, user.username, resetUrl);
    
    if (!emailSent) {
      return res.status(500).json({ 
        message: 'Failed to send password reset email. Please try again.',
        success: false
      });
    } 
    
    return res.status(200).json({ 
      message: 'If your email is in our system, you will receive a reset link',
      success: true
    });

  } catch (err) {
    console.error('Forgot password error:', err.message)
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: 'Verification token is required' });
  }

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Mark user as verified and clear verification token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    
    await user.save();

    // Send welcome email after verification
    sendWelcomeEmail(user.email, user.username).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    res.status(200).json({ 
      message: 'Email verified successfully! You can now log in to your account.',
      success: true
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

    // Update user with new verification token
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Send new verification email
    const emailSent = await sendVerificationEmail(email, verificationToken, user.username);
    
    if (emailSent) {
      res.status(200).json({ 
        message: 'Verification email sent successfully. Please check your inbox.',
        success: true
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to send verification email. Please try again.',
        success: false
      });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};