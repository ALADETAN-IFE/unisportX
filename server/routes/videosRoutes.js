const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const { uploadVideo, getVideos } = require('../controllers/videoController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload-youtube', [auth, upload.single('video')], uploadVideo);

router.get('/get-videos', getVideos);

module.exports = router;
