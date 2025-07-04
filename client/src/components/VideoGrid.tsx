import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface IVideo {
  _id: string;
  title: string;
  faculty: string;
  youtubeLink: string;
}

const VideoGrid = () => {
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/videos');
        setVideos(res.data);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };
    fetchVideos();
  }, []);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdWithParams = url.split('v=')[1];
    const videoId = videoIdWithParams ? videoIdWithParams.split('&')[0] : '';
    return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Uploaded Videos</h2>
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
            <h3 className="font-bold text-gray-800 dark:text-white mt-2">{video.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{video.faculty}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;