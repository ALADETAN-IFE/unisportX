const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { allUser, deleteUser } = require('../controllers/adminController');

router.get('/users/all-user', auth, allUser);
router.post('/users/delete-user', auth, deleteUser);

module.exports = router; 