const express = require('express');
const router = express.Router();
const { signup, login, logout, forgotPassword, resetPassword, verifyEmail, resendVerification, check } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/check', check);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

module.exports = router; 