import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import type { Post } from '../interface'

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState('all');
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async (pageNum: number = 1, append: boolean = false) => {
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10'
      });

      if (category !== 'all') {
        params.append('category', category);
      }

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/posts?${params}`,
        { withCredentials: true }
      );

      const newPosts = response.data.posts;
      
      if (append) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      setHasMore(pageNum < response.data.totalPages);
      setPage(pageNum);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching posts:', error);
        const errorMessage = error.response?.data?.message || 'Error fetching posts';
        console.error('Error fetching posts:', errorMessage);
      } else {
        console.error('Something went wrong');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, false);
  }, [category]);

  // Auto-refresh posts every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPosts(1, false);
    }, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [category]); // Re-create interval when category changes

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      fetchPosts(page + 1, true);
    }
  };

  const handlePostCreated = () => {
    fetchPosts(1, false);
  };

  const handlePostUpdated = () => {
    fetchPosts(1, false);
  };

  const categories = [
    { value: 'all', label: 'All Posts' },
    { value: 'general', label: 'General' },
    { value: 'sports', label: 'Sports' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'training', label: 'Training' },
    { value: 'competition', label: 'Competition' },
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Feed"
        description="Connect with the UniSportX community through posts, share your sports moments, achievements, and training updates. Join the conversation with fellow athletes and sports enthusiasts."
        keywords="sports feed, athletic community, sports posts, university sports social, athlete updates, sports sharing, community posts"
        url="/app"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SocialMediaPosting",
          "name": "UniSportX Feed",
          "description": "University sports community feed",
          "url": "https://unisport-x.vercel.app/app"
        }}
      />
      {/* <div className="container mx-auto p-4 max-w-4xl"> */}
      <div className="container mx-auto p-4 space-x-4 lg:max-w-4xl ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Feed
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your sports moments and connect with other athletes
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {category === 'all' 
                  ? 'Be the first to share something!'
                  : `No ${category} posts yet. Be the first to share!`
                }
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostUpdated={handlePostUpdated}
              />
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMore && posts.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loadingMore ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                'Load More Posts'
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
    </>
  );
};

export default FeedPage; 