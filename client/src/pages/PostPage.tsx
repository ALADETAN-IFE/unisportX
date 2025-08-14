import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import customAxios from '../api/axiosInstance';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import type { Post } from '../interface';
import type { RootState } from '../global/Redux-Store/Store';
import Comment from '../components/Comment';
import { formatRelativeTime } from '../utils/date';

const PostPage = () => {
  const { postId } = useParams();
    const navigate = useNavigate();
    
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    

    const { userData: user } = useSelector((state: RootState) => state.uniSportX);

    const fetchPost = async () => {
        if (!postId) {
            setError('Post ID is required');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/posts/${postId}`);
            setPost(response.data.post);
        } catch (err) {
            console.error('Error fetching post:', err);
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 404) {
                    setError('Post not found');
                } else {
                    setError(err.response?.data?.message || 'Error fetching post');
                }
            } else {
                setError('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);

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

        if (!post) {
          toast.error('Post not found');
          return;
        }
    
        setCommentLoading(true);
        try {
          await customAxios.post(`/posts/${post._id}/comments`, {
            content: newComment.trim()
          });
          
          setNewComment('');
          fetchPost(); // Refresh the post to get updated comments
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
        if (!post) {
          toast.error('Post not found');
          return;
        }

        try {
          setIsDeleting(true);
          await customAxios.delete(`/posts/${post._id}/comments/${commentId}`);
          
          fetchPost(); // Refresh the post to get updated comments
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
          setIsDeleting(false);
        }
      };

    const handlePostUpdated = () => {
        fetchPost();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            {error}
                        </h1>
                        <button
                            onClick={() => navigate('/app')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Feed
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            Post not found
                        </h1>
                        <button
                            onClick={() => navigate('/app')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Feed
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO 
                // title={`Post by ${post.author.username}`}
                title={`${post.content.substring(0, 50)}... by ${post.author.username}`}
                description={post.content.substring(0, 160)}
                keywords={post.tags.join(', ')}
                image={post.images?.[0]?.url}
                type="article"
                url={`/app/${post._id}`}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-6">
                            <button
                                onClick={() => navigate('/app')}
                                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Feed
                            </button>
                        </div>
                        
                        <PostCard 
                            post={post} 
                            onPostUpdated={handlePostUpdated}
                        />

                        {/* Post Stats */}
                        {/* <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center space-x-4">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        {post.likes.length} likes
                                    </span>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        {post.comments.length} comments
                                    </span>
                                </div>
                                <span className="text-xs">
                                    {formatRelativeTime(post.createdAt)}
                                </span>
                            </div>
                        </div> */}

                        {/* Comments Section */}
                        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            {/* Comments Header */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Comments ({post.comments.length})
                                </h3>
                            </div>

                            {/* Add Comment */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <form onSubmit={handleAddComment} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="flex-1 sm:px-3 pr-1 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        disabled={commentLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={commentLoading || !newComment.trim()}
                                        className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors "
                                    >
                                        {commentLoading ? 'Posting...' : 'Post'}
                                    </button>
                                </form>
                            </div>

                            {/* Comments List */}
                            <div className="max-h-96 overflow-y-auto">
                                {post.comments.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No comments yet. Be the first to comment!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-4 space-y-4">
                                        {post.comments.map((comment) => (
                                            <Comment
                                                key={comment._id}
                                                comment={comment}
                                                user={user || undefined}
                                                isDeleting={isDeleting}
                                                handleDeleteComment={handleDeleteComment}
                                                formatDate={formatRelativeTime}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default PostPage;