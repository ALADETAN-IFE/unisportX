const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from cookie
  const token = req.cookies.token;

  // Debug logging for production issues
  if (process.env.NODE_ENV === 'production') {
    console.log('Auth middleware - Cookies:', req.cookies);
    console.log('Auth middleware - Headers:', req.headers);
    console.log('Auth middleware - Origin:', req.headers.origin);
  }

  // Check if not token
  if (!token) {
    console.log('No token found in cookies');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
}; 