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

    // Determine if we're in production
    const isProduction = process.env.NODE_ENV === 'production';
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const isLocalhost = clientUrl.includes('localhost') || clientUrl.includes('127.0.0.1');

    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction && !isLocalhost, // Only use secure in production with HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: isProduction && !isLocalhost ? 'none' : 'lax', // Use 'none' for cross-domain in production
        domain: isProduction && !isLocalhost ? undefined : undefined // Let browser handle domain
    });

    return token;
}   