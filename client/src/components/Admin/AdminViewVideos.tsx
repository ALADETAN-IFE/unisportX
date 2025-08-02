import { motion } from 'motion/react';
import type { Video } from '../../interface';
import { getFacultyColor } from '../../utils/datas';

interface AdminViewVideosProps {
    video: Video;
    index: number;
    deleteVideo: (videoId: string) => void;
    formatDate: (dateString: string) => string;
}

const getYouTubeEmbedUrl = (url: string) => {
  const videoIdWithParams = url.split('v=')[1];
  const videoId = videoIdWithParams ? videoIdWithParams.split('&')[0] : '';
  return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`;
};


const AdminViewVideos = ({ video, index, deleteVideo, formatDate }: AdminViewVideosProps) => {
    return(
        <motion.div
        key={video._id}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
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
        <div className="p-4 space-y-3">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg line-clamp-2">
            {video.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFacultyColor(video.school?.faculty || 'Other')}`}>
               {video.school?.faculty || 'N/A'}
            </span>
            {video.createdAt && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(video.createdAt)}
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {video.description}
          </p>
          {video.uploadedBy.email && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Uploaded by: {video.uploadedBy.email}
            </p>
          )}
          <div className="flex gap-2 pt-2">
            <a
              href={video.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-red-600 text-white text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              View
            </a>
            <button
              onClick={() => deleteVideo(video._id)}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              title="Delete video"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    )
}

export default AdminViewVideos