// import { Link } from 'react-router-dom';
import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import VideoGrid from '../components/VideoGrid';
import SEO from '../components/SEO';

const VideosPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadVideos, setLoadVideos] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  setTimeout(() => {
    setLoading(false)
  }, 2000);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading UniSportX...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <SEO 
        title="Videos"
        description="Watch and upload university sports highlights on UniSportX. Browse through the latest athletic moments, share your own videos, and connect with the university sports community."
        keywords="university sports videos, sports highlights, athletic videos, campus sports, student athletes, sports upload, video sharing"
        url="/app/videos"
        type="video"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "VideoGallery",
          "name": "UniSportX Videos",
          "description": "University sports highlights and videos",
          "url": "https://unisport-x.vercel.app/app/videos"
        }}
      />
      {/*  <div className="container mx-auto p-4 flex justify-center">
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
        </Link> */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              UniSportX Videos
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Share your university sports highlights, watch amazing athletic moments, and connect with the sports community.
            </p>
          </div>

              {/* Main Content */}
          {/* <div className="flex flex-col lg:flex-row gap-8 items-start"> */}
            {/* Upload Section */}
            {/* <div className="lg:w-96 lg:flex-shrink-0">
              <div className="sticky top-4">
                <UploadForm setLoadVideos={setLoadVideos}/>
              </div>
            </div> */}
            {/*  */}
            {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Video Upload</h3>
              <p className="text-gray-600 dark:text-gray-400">Upload and manage videos</p> */}
            {/* Videos Section */}
            {/* <div className="flex-1 min-w-0">
              <VideoGrid loadVideos={loadVideos} setLoadVideos={setLoadVideos}/>
            </div>
          </div> */}
          {/*         </div>
      </div> */}

          {/* Videos Section */}
          <div className="w-full">
            <VideoGrid loadVideos={loadVideos} setLoadVideos={setLoadVideos}/>
          </div>

{/* <div className="flex flex-col gap-8 items-center">
        <div className="md:w-[450px]">
          <UploadForm setLoadVideos={setLoadVideos}/>
        </div>
        <div className="flex flex-wrap">
          <VideoGrid loadVideos={loadVideos} setLoadVideos={setLoadVideos}/>
        </div>
      </div>
    </div> */}
          {/* Footer Info */}
          <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">
              Upload your sports videos and share them with the university community. 
              All videos are automatically uploaded to YouTube for better accessibility.
            </p>
          </div>
        </div>

        {/* Floating Upload Button */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
          aria-label="Upload video"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Video</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <UploadForm 
                  setLoadVideos={setLoadVideos}
                  onSuccess={() => setShowUploadModal(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VideosPage; 