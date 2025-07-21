import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import type { RootState } from '../global/Redux-Store/Store';
import EditPost from './EditPost';
import DeletePostConfirm from './DeletePostConfirm';
import Comment from '../components/Comment';
import type { Post } from '../interface'
import { formatRelativeTime } from "../utils/date"

interface PostCardProps {
  post: Post;
  onPostUpdated: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const user = useSelector((state: RootState) => state.uniSportX.userData);

  // Update local post when prop changes
  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const reactionTypes = [
    { type: 'like', emoji: '👍', label: 'Like' },
    { type: 'love', emoji: '❤️', label: 'Love' },
    { type: 'haha', emoji: '😂', label: 'Haha' },
    { type: 'fire', emoji: '🔥', label: 'Fire' },
    { type: 'goal', emoji: '⚽', label: 'Goal' },
    { type: 'trophy', emoji: '🏆', label: 'Trophy' },
    { type: 'muscle', emoji: '💪', label: 'Strong' },
    { type: 'clap', emoji: '👏', label: 'Clap' },
    { type: 'wow', emoji: '😮', label: 'Wow' },
  ];

  const getUserReaction = () => {
    return localPost.likes.find(like => like.user._id === user?._id);
  };

  const handleReaction = async (reactionType: string) => {
    if (!user) {
      toast.error('Please login to react to posts');
      return;
    }

    const currentReaction = getUserReaction();
    
    // Optimistic update - immediately update the local state
    if (currentReaction?.type === reactionType) {
      // Remove reaction - immediately remove from UI
      setLocalPost(prev => ({
        ...prev,
        likes: prev.likes.filter(like => like.user._id !== user._id),
        likeCount: Math.max(0, prev.likeCount - 1)
      }));
    } else {
      // Add/update reaction - immediately add to UI
      setLocalPost(prev => {
        const updatedLikes = prev.likes.filter(like => like.user._id !== user._id);
        updatedLikes.push({
          _id: `temp-${Date.now()}`,
          user: { _id: user._id, username: user.username },
          type: reactionType
        });
        return {
          ...prev,
          likes: updatedLikes,
          likeCount: prev.likeCount + (currentReaction ? 0 : 1)
        };
      });
    }

    // Make API call in background
    try {
      if (currentReaction?.type === reactionType) {
        // Remove reaction
        await axios.delete(`${import.meta.env.VITE_SERVER_URL}/posts/${post._id}/react`, {
          withCredentials: true
        });
      } else {
        // Add/update reaction
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/posts/${post._id}/react`, {
          reactionType
        }, {
          withCredentials: true
        });
      }
      
      // Success - sync with server data
      onPostUpdated();
    } catch (error) {
      
      // Revert optimistic update on error by refreshing the post
      onPostUpdated();
      
      if (axios.isAxiosError(error)) {
        console.error('Error handling reaction:', error);
        // toast.error(error.response?.data?.message || 'Error handling reaction');
      } else {
        toast.error('Error handling reaction');
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setCommentLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/posts/${post._id}/comments`, {
        content: newComment.trim()
      }, {
        withCredentials: true
      });
      
      setNewComment('');
      onPostUpdated();
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error adding comment');
      } else {
        toast.error('Error adding comment');
      }
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setIsDeleting(true)
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/posts/${post._id}/comments/${commentId}`, {
        withCredentials: true
      });
      
      onPostUpdated();
      toast.success('Comment deleted successfully');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error deleting comment:', error);
        const errorMessage = error.response?.data?.message || 'Error deleting comment';
        toast.error(errorMessage);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsDeleting(false)
    }
  };

  const handleEditPost = () => {
    setShowEditModal(true);
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/posts/${post._id}`, {
        withCredentials: true
      });
      
      toast.success('Post deleted successfully');
      onPostUpdated();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Error deleting post');
      } else {
        toast.error('Error deleting post');
      }
    }
  };



  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Post Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {
                post.author?.profilePicture ? (
                    <img src={post.author?.profilePicture || '/default-avatar.png'} alt={post.author.username.charAt(0).toUpperCase()}/>
                ): `${post.author.username.charAt(0).toUpperCase()}`
              }
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {post.author.username.charAt(0).toUpperCase() + post.author.username.slice(1)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatRelativeTime(localPost.createdAt)} • {localPost.category}
              </p>
            </div>
          </div>
          
          {/* Edit/Delete buttons for post author */}
          {user?._id === post.author._id && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEditPost}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                title="Edit post"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete post"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      {localPost.content && (
        <div className="p-4">
          <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
            {localPost.content}
          </p>
        </div>
      )}

      {/* Post Images */}
      {localPost.images.length > 0 && (
        <div className="px-4 pb-4 flex justify-center">
          {localPost.images.length === 1 ? (
            <img
              src={localPost.images[0].url}
              alt="Post"
              className="w-max max-h-96 object-cover rounded-lg"
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {localPost.images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Post ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
              {localPost.images.length > 4 && (
                <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                    +{localPost.images.length - 4}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {localPost.tags.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {localPost.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reaction Stats */}
      {localPost.likeCount > 0 && (
        <div className="px-4 pb-2">
          <div className="flex items-center space-x-1">
            <div className="flex -space-x-1">
              {reactionTypes.map((reaction) => {
                const count = localPost.likes.filter(like => like.type === reaction.type).length;
                if (count > 0) {
                  return (
                    <div
                      key={reaction.type}
                      className="w-6 h-6 bg-white dark:bg-gray-800 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs"
                      title={`${count} ${reaction.label}`}
                    >
                      {reaction.emoji}
                    </div>
                  );
                }
                return null;
              })}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {localPost.likeCount} {localPost.likeCount === 1 ? 'reaction' : 'reactions'}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {/* Reaction Buttons */}
          <div className="relative group">
            <div className="flex items-center space-x-1">
              {(() => {
                const userReaction = getUserReaction();
                
                // If user has reacted, show their reaction
                if (userReaction) {
                  const userReactionData = reactionTypes.find(r => r.type === userReaction.type);
                  if (userReactionData) {
                    return (
                      <button
                        onClick={() => handleReaction(userReactionData.type)}

                        className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                      >
                        <span>{userReactionData.emoji}</span>
                        <span className="hidden sm:inline">{userReactionData.label}</span>
                      </button>
                    );
                  }
                }

                // Otherwise show the first reaction (like)
                const firstReaction = reactionTypes[0];
                return (
                  <button
                    onClick={() => handleReaction(firstReaction.type)}
                    className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    <span>{firstReaction.emoji}</span>
                    <span className="hidden sm:inline">{firstReaction.label}</span>
                  </button>
                );
              })()}
            </div>
            
            {/* Hover to show all reactions */}
            <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-2 py-1">
                <div className="flex items-center space-x-1">
                  {reactionTypes.map((reaction) => (
                    <button
                      key={reaction.type}
                      onClick={() => handleReaction(reaction.type)}

                      className="w-8 h-8 flex items-center justify-center text-lg hover:scale-110 transition-transform"
                      title={reaction.label}
                    >
                      {reaction.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{localPost.commentCount} Comments</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Add Comment */}
          <div className="p-4">
            <form onSubmit={handleAddComment} className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={commentLoading}
              />
              <button
                type="submit"
                disabled={commentLoading || !newComment.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {commentLoading ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>

          {/* Comments List */}
          <div className="px-4 pb-4 max-h-64 overflow-y-auto">
            {localPost.comments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-3">
                {localPost.comments.map((comment) => (
                  <Comment
                    key={comment._id}
                    comment={comment}
                    user={user!}
                    isDeleting={isDeleting}
                    handleDeleteComment={handleDeleteComment}
                    formatDate={formatRelativeTime}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Edit Post Modal */}
      <EditPost
        post={localPost}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onPostUpdated={onPostUpdated}
      />
      
      {/* Delete Post Confirmation */}
      <DeletePostConfirm
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePost}
        postTitle={`"${localPost.content.substring(0, 50)}${localPost.content.length > 50 ? '...' : ''}"`}
      />
    </motion.div>
  );
};

export default PostCard; 