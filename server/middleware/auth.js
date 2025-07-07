const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from cookie
  const token = req.cookies.token;

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