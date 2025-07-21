import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { Video } from '../interface';
import { formatRelativeTime } from "../utils/date"

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isExpanded, setIsExpanded] = useState(false);


  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(video.youtubeLink);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {/* <img
            src={video.uploadedBy?.profilePicture || '/default-avatar.png'}
            alt={video.uploadedBy?.username}
            /> */}
            {
              video.uploadedBy?.profilePicture ? (
                <img 
                  src={video.uploadedBy?.profilePicture || '/default-avatar.png'} 
                  alt={video.uploadedBy?.username.charAt(0).toUpperCase()}
                  className="w-10 h-10 rounded-full object-cover"
                  />
              ): `${video.uploadedBy?.username.charAt(0).toUpperCase()}`
            }
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {video.uploadedBy.username}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatRelativeTime(video.uploadTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Video Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {video.title}
        </h2>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {video.description}
        </p>

        {/* Video Embed */}
        {embedUrl && (
          <div className="relative w-full mb-4" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={embedUrl}
              title={video.title}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Video Details */}
        <div className="space-y-2 mb-4 relative">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Country:</span>
            <span className="ml-2">{video.country}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 absolute !mt-0 top-0 right-0">
            <span className="font-medium">School:</span>
            <span className="ml-2">{video.school.name}</span>
          </div>

          {video.school.faculty && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Faculty:</span>
              <span className="ml-2">{video.school.faculty}</span>
            </div>
          )}
          {video.school.department && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 absolute top-4 right-4">
              <span className="font-medium">Department:</span>
              <span className="ml-2">{video.school.department}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Event Type:</span>
            <span className="ml-2">{video.eventType}</span>
          </div>
        </div>

        {/* Participants */}
        {video.participants && video.participants.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Participants:
            </h4>
            <div className="flex flex-wrap gap-2">
              {video.participants.map((participant, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                >
                  {participant.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expandable Description */}
        {video.description.length > 200 && (
          <div className="mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoCard; 