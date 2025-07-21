import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { getFacultyColor } from "../utils/datas"
import { toast } from 'react-toastify';

interface IVideo {
  _id: string;
  title: string;
  school: {
    name: string;
    faculty: string;
  }
  youtubeLink: string;
  description: string;
  createdAt?: string;
  uploadDate?: string;
}

interface reloadVideo {
  loadVideos: boolean;
  setLoadVideos: (loadVideos: boolean) => void;
}

const VideoGrid = ({ loadVideos, setLoadVideos }: reloadVideo) => {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  
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
    return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  const filteredVideos = selectedFaculty === 'all' 
    ? videos 
    : videos.filter(video => video.school.faculty === selectedFaculty);

  const uniqueFaculties = [...new Set(videos.map(video => video.school.faculty))];

  if (loading && videos.length === 0) {
    return (
      <div className="p-4 w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading videos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 w-full">
        <div className="text-center text-red-500 dark:text-red-400">
          <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-lg font-medium">{error}</p>
          <button 
            onClick={fetchVideos}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Uploaded Videos {videos.length > 0 && `(${videos.length})`}
        </h2>
        
        {/* Faculty Filter */}
        {videos.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Faculty:
            </label>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="px-3 py-1 text-sm border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Faculties</option>
              {uniqueFaculties.map(faculty => (
                <option key={faculty} value={faculty}>{faculty}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No videos uploaded yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Be the first to upload a video and share your sports highlights!</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No videos found for the selected faculty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Video Embed */}
              <div className="relative aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={getYouTubeEmbedUrl(video.youtubeLink)}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Video Info */}
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-gray-800 dark:text-white text-lg line-clamp-2" title={video.title}>
                  {video.title}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFacultyColor(video.school.faculty)}`}>
                    {video.school.faculty}
                  </span>
                  {(video.createdAt || video.uploadDate) && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(video.createdAt || video.uploadDate!)}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3" title={video.description}>
                  {video.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <a
                    href={video.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-red-600 text-white text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Watch on YouTube
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(video.youtubeLink);
                      toast.success("link successfully copied to clipboard", {position : 'top-center'})
                    }}
                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                    title="Copy link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGrid;