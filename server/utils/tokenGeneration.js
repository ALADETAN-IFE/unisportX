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
        secure:  process.env.NODE_ENV === 'production', 
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'None',
        path: '/',
        // sameSite: isProduction && !isLocalhost ? 'none' : 'lax', // Use 'none' for cross-domain in production
        // domain: isProduction && !isLocalhost ? undefined : undefined // Let browser handle domain
    });

    return token;
}   