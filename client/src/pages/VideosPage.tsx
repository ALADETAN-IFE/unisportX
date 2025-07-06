// import { Link } from 'react-router-dom';
import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import VideoGrid from '../components/VideoGrid';

const VideosPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadVideos, setLoadVideos] = useState(true);

  setTimeout(() => {
    setLoading(false)
  }, 2000);

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
    <div className="container mx-auto p-4 flex justify-center">
      {/* Navigation Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          to="/app/feed"
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Feed</h3>
              <p className="text-gray-600 dark:text-gray-400">Share posts, react, and comment</p>
            </div>
          </div>
        </Link>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Video Upload</h3>
              <p className="text-gray-600 dark:text-gray-400">Upload and manage videos</p>
            </div>
          </div>
        </div>
      </div> */}

      <div className="flex flex-col gap-8 items-center">
        <div className="md:w-[450px]">
          <UploadForm setLoadVideos={setLoadVideos}/>
        </div>
        <div className="flex flex-wrap">
          <VideoGrid loadVideos={loadVideos} setLoadVideos={setLoadVideos}/>
        </div>
      </div>
    </div>
  );
};

export default VideosPage; 