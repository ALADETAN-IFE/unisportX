require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.generateToken = (user, res) => {
    const payload = {
      user: {
        id: user.id,
      },
    };

    // console.log("payload:", payload)
    // console.log("user:", user)
    
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // console.log("token generated", token)

    res.cookie('token', token, {
        httpOnly: true,
        secure:  process.env.NODE_ENV === 'production', 
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict',
        // sameSite: 'strict',
        path: '/',
        // sameSite: isProduction && !isLocalhost ? 'none' : 'lax', // Use 'none' for cross-domain in production
        // domain: isProduction && !isLocalhost ? undefined : undefined // Let browser handle domain
    });

    return token;
}   