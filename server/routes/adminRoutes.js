const express = require('express');
const router = express.Router();
const { allUser, deleteUser } = require('../controllers/adminController');

router.get('/all-user', allUser);
router.post('/delete-user', deleteUser);

module.exports = router; 