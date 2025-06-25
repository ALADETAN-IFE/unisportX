require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.generateToken = (user, res) => {
    const payload = {
      user: {
        id: user.id,
      },
    };
    
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'strict'
    });

    return token;
}   