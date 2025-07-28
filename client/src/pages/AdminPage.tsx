import { useState, useEffect } from 'react';
import axios from 'axios';
import customAxios from '../api/axiosInstance.ts';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import { getFacultyColor } from "../utils/datas";
import type { UserData } from '../interface';

interface IVideo {
  _id: string;
  title: string;
  faculty: string;
  youtubeLink: string;
  description: string;
  createdAt?: string;
  uploadDate?: string;
  userId?: string;
  userEmail?: string;
}


const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'videos' | 'users'>('videos');
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData(true);
  }, []);

  useEffect(() => {
    fetchData(false);
  }, [activeTab]);

  const fetchData = async (onPageLoad: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      if (onPageLoad === true){
        const resVideos = await customAxios.get(`/videos/get-videos`);
        const resUsers = await customAxios.get(`/admin/users/all-user`);
        
        setVideos(resVideos.data.videos || []);
        setUsers(resUsers.data || []);
      } else if (activeTab === 'videos') {
        const res = await customAxios.get(`/videos/get-videos`);
        setVideos(res.data.videos || []);
      } else {
        const res = await customAxios.get(`/admin/users/all-user`);
        setUsers(res.data || []);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch data');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      await customAxios.delete(`/admin/users/videos/${videoId}`);
      toast.success('Video deleted successfully');
      fetchData(false);
    } catch (err) {
      toast.error('Failed to delete video');
      console.error('Delete video error:', err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await customAxios.delete(`/admin/users/delete-user/${userId}`);
      toast.success('User deleted successfully');
      fetchData(false);
    } catch (err) {
      toast.error('Failed to delete user');
      console.error('Delete user error:', err);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await customAxios.patch(`/admin/users/${userId}/status`, {
        isActive: !isActive
      }, {
        withCredentials: true
      });
      toast.success(`User ${isActive ? 'deactivated' : 'activated'} successfully`);
      fetchData(false);
    } catch (err) {
      toast.error('Failed to update user status');
      console.error('Toggle user status error:', err);
    }
  };

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const filteredVideos = videos.filter(video => {
    const matchesFaculty = selectedFaculty === 'all' || video.faculty === selectedFaculty;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFaculty && matchesSearch;
  });

  const filteredUsers = users.filter(user => {
    return user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.faculty?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const uniqueFaculties = [...new Set(videos.map(video => video.faculty))];

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-500 dark:text-red-400">
          <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-lg font-medium">{error}</p>
          <button 
            onClick={() => fetchData(false)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Admin Panel"
        description="Admin panel for managing videos and users on UniSportX"
        keywords="admin panel, video management, user management, university sports admin"
        url="/app/admin"
        type="website"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Admin Panel
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Manage videos and users on UniSportX
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md p-1">
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'videos'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Videos ({videos.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Users ({users.length})
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            {activeTab === 'videos' && (
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Faculties</option>
                {uniqueFaculties.map(faculty => (
                  <option key={faculty} value={faculty}>{faculty}</option>
                ))}
              </select>
            )}
          </div>

          {/* Content */}
          {activeTab === 'videos' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFacultyColor(video.faculty)}`}>
                        {video.faculty}
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
                    {video.userEmail && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Uploaded by: {video.userEmail}
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
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Faculty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Verified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.username || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFacultyColor(user.faculty || 'Other')}`}> 
                            {user.faculty || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {user.role || 'User'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.isVerified
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {user.isVerified ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleUserStatus(user._id, user.isActive || false)}
                              className={`px-2 py-1 rounded text-xs ${
                                user.isActive
                                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                  : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {((activeTab === 'videos' && filteredVideos.length === 0) || 
            (activeTab === 'users' && filteredUsers.length === 0)) && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No {activeTab} found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : `No ${activeTab} available.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPage; 