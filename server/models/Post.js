const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const reactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'love', 'haha', 'fire', 'goal', 'trophy', 'muscle', 'clap', 'wow'],
    default: 'like'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    width: Number,
    height: Number
  }],
  likes: [reactionSchema],
  comments: [commentSchema],
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['sports', 'general', 'achievement', 'training', 'competition'],
    default: 'general'
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Method to add like
postSchema.methods.addLike = function(userId, reactionType = 'like') {
  // Remove existing reaction from this user
  this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  
  // Add new reaction
  this.likes.push({
    user: userId,
    type: reactionType
  });
  
  return this.save();
};

// Method to remove like
postSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  return this.save();
};

// Method to add comment
postSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content: content
  });
  
  return this.save();
};

// Method to remove comment
postSchema.methods.removeComment = function(commentId, userId) {
  // this.comments = this.comments.filter(comment => 
  //   comment._id.toString() !== commentId.toString() && 
  //   comment.user._id.toString() === userId.toString()
  // );

  this.comments = this.comments.filter(comment => 
    comment._id.toString() !== commentId.toString() ||
    comment.user.toString() !== userId.toString()
);
  
  return this.save();
};

// Ensure virtual fields are serialized
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema); 