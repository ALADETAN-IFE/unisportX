const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { allUser, deleteUser } = require('../controllers/adminController');

router.get('/user/all-user',auth, allUser);
router.post('/user/delete-user',auth, deleteUser);

module.exports = router; 