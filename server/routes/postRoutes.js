const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getPosts, 
  getPost, 
  updatePost, 
  deletePost,
  reactToPost,
  removeReaction,
  addComment,
  removeComment,
  getUserPosts
} = require('../controllers/postController');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/user/:userId', getUserPosts);

// Protected routes (require authentication)
router.use(auth);

// Post CRUD operations
router.post('/', uploadSingle, createPost);
router.post('/multiple', uploadMultiple, createPost);
router.put('/:id', uploadSingle, updatePost);
router.delete('/:id', deletePost);

// Reactions
router.post('/:id/react', reactToPost);
router.delete('/:id/react', removeReaction);

// Comments
router.post('/:id/comments', addComment);
router.delete('/:id/comments/:commentId', removeComment);

module.exports = router; 