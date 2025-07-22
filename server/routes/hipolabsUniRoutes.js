const express = require('express');
const router = express.Router();
const universitiesProxy = require('../controllers/hipolabsUniversitiesProxy.js');

router.get('/', universitiesProxy);

module.exports = router; 