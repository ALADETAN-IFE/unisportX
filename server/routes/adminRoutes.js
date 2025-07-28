const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { allUser, deleteUser, toggleUserStatus, deleteVideo } = require('../controllers/adminController');

router.get('/users/all-user', adminAuth, allUser);
router.post('/users/delete-user', adminAuth, deleteUser);
router.patch('/users/:id/status', adminAuth, toggleUserStatus);
router.delete('/users/videos/:id', adminAuth, deleteVideo);

module.exports = router; 