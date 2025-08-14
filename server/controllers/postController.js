const Post = require('../models/Post');
const Video = require('../models/Video');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'unisportx/posts',
        resource_type: 'auto',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to stream
    const readableStream = new Readable();
    readableStream.push(file.buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, tags, category, isPublic } = req.body;
    const userId = req.user.id;

    if (!content && (!req.file && !req.files)) {
      return res.status(400).json({ message: 'Post content or image is required' });
    }

    let images = [];

    // Handle single image upload
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      images.push({
        public_id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height
      });
    }

    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file);
        images.push({
          public_id: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height
        });
      }
    }

    const post = new Post({
      author: userId,
      content: content || '',
      images,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      category: category || 'general',
      isPublic: isPublic !== 'false'
    });

    await post.save();
    await post.populate('author', 'username email profilePicture');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

// Get all posts and videos (with pagination)
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const author = req.query.author;

    const postQuery = { isPublic: true };
    const videoQuery = {};
    
    if (category && category !== 'all') {
      postQuery.category = category;
      videoQuery.eventType = category;
    }
    
    if (author) {
      postQuery.author = author;
      videoQuery.uploadedBy = author;
    }

    // Fetch posts and videos in parallel
    const [posts, videos] = await Promise.all([
      Post.find(postQuery)
        .populate('author', 'username email profilePicture')
        .populate('comments.user', 'username profilePicture')
        .populate('likes.user', 'username')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Video.find(videoQuery)
        .populate('uploadedBy', 'username email profilePicture')
        .sort({ uploadTime: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
    ]);

    // Combine and sort by creation date
    const combinedFeed = [...posts, ...videos].sort((a, b) => {
      const dateA = a.createdAt || a.uploadTime;
      const dateB = b.createdAt || b.uploadTime;
      return new Date(dateB) - new Date(dateA);
    });

    // Get total counts
    const [totalPosts, totalVideos] = await Promise.all([
      Post.countDocuments(postQuery),
      Video.countDocuments(videoQuery)
    ]);

    const total = totalPosts + totalVideos;

    res.json({
      posts: combinedFeed,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      totalPostCount: totalPosts,
      totalVideoCount: totalVideos
    });
  } catch (error) {
    console.error('Error fetching posts and videos:', error);
    res.status(500).json({ message: 'Error fetching posts and videos' });
  }
};

// Get single post by ID
exports.getPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId)
      .populate('author', 'username email')
      .populate('comments.user', 'username profilePicture')
      .populate('likes.user', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { content, tags, category, isPublic } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    // Handle image upload if provided
    let images = post.images;
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      images.push({
        public_id: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        content: content || post.content,
        images,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : post.tags,
        category: category || post.category,
        isPublic: isPublic !== undefined ? isPublic !== 'false' : post.isPublic
      },
      { new: true }
    ).populate('author', 'username email');

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete images from Cloudinary
    for (const image of post.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await Post.findByIdAndDelete(postId);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};

// Add/Update reaction to post
exports.reactToPost = async (req, res) => {
  try {
    const { reactionType } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.addLike(userId, reactionType);
    await post.populate('likes.user', 'username');

    res.json({
      message: 'Reaction added successfully',
      likes: post.likes
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ message: 'Error adding reaction' });
  }
};

// Remove reaction from post
exports.removeReaction = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.removeLike(userId);
    await post.populate('likes.user', 'username');

    res.json({
      message: 'Reaction removed successfully',
      likes: post.likes
    });
  } catch (error) {
    console.error('Error removing reaction:', error);
    res.status(500).json({ message: 'Error removing reaction' });
  }
};

// Add comment to post
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.addComment(userId, content.trim());
    await post.populate('comments.user', 'username profilePicture');

    res.json({
      message: 'Comment added successfully',
      comments: post.comments
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
};

// Remove comment from post
exports.removeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.removeComment(commentId, userId);
    await post.populate('comments.user', 'username');

    res.json({
      message: 'Comment removed successfully',
      comments: post.comments
    });
  } catch (error) {
    console.error('Error removing comment:', error);
    res.status(500).json({ message: 'Error removing comment' });
  }
};

// Get user's posts
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const posts = await Post.find({ 
      author: userId,
      isPublic: true 
    })
      .populate('author', 'username email')
      .populate('comments.user', 'username profilePicture')
      .populate('likes.user', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments({ 
      author: userId,
      isPublic: true 
    });

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Error fetching user posts' });
  }
}; 