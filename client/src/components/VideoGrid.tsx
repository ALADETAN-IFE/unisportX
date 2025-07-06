import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface IVideo {
  _id: string;
  title: string;
  faculty: string;
  youtubeLink: string;
  description: string;
}

interface reloadVideo {
  loadVideos: boolean;
  setLoadVideos: (loadVideos: boolean) => void;
}

const VideoGrid = ({ loadVideos, setLoadVideos }: reloadVideo) => {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchVideos = async () => {
    try {
      setLoadVideos(false);
      setLoading(true);
      setError(null);
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/videos/get-videos`);
      setVideos(res.data.videos);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data?.message;
        if(errorData){
          setVideos(err.response?.data?.videos);
          return
        }
        console.error('Error fetching videos:', errorData);
        setError(errorData);
      } else{
        console.error('Error fetching videos:', err);
        setError('Failed to load videos');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch videos when loadVideos changes to true
  useEffect(() => {
    if (loadVideos) {
      fetchVideos();
    }
  }, [loadVideos]);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdWithParams = url.split('v=')[1];
    const videoId = videoIdWithParams ? videoIdWithParams.split('&')[0] : '';
    return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
  };

  if (loading && videos.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Uploaded Videos</h2>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Uploaded Videos</h2>
        <div className="text-center text-red-500 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Uploaded Videos {videos.length > 0 && `(${videos.length})`}
      </h2>
      {videos.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No videos uploaded yet. Be the first to upload a video!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <iframe
                width="100%"
                height="200"
                src={getYouTubeEmbedUrl(video.youtubeLink)}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-md"
              ></iframe>
              <h3 className="font-bold text-gray-800 dark:text-white mt-2 truncate" title={video.title}>
                {video.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 truncate" title={video.faculty}>
                {video.faculty}
              </p>
              <p className="text-gray-500 dark:text-gray-300 text-sm mt-1 line-clamp-2" title={video.description}>
                {video.description}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGrid;