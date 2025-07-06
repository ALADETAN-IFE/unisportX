import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UploadForm = ({ setLoadVideos }: { setLoadVideos: (loadVideos: boolean)=> void; }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [faculty, setFaculty] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('faculty', faculty);
    formData.append('video', file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/videos/upload-youtube`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      console.log('File uploaded successfully:', res.data);
      setMessage('File uploaded successfully!');
      setLoadVideos(true)
      toast.success('Video uploaded successfully!');
      setTitle('');
      setDescription('');
      setFaculty('');
      setFile(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;
        
        // Check for YouTube channel not found
        if (errorData?.error === 'YouTube channel not found') {
          setMessage('YouTube channel not found. Please ensure the YouTube account is properly set up and has a channel created.');
        }
        // Check for YouTube OAuth token expiration
        else if (errorData?.msg?.response?.data?.error === 'invalid_grant') {
          setMessage('YouTube authentication has expired. Please contact the administrator to refresh the YouTube API credentials.');
        } else if (errorData?.msg?.response?.data?.error_description?.includes('Token has been expired or revoked')) {
          setMessage('YouTube API token has expired. Please contact the administrator to update the YouTube integration.');
        } else if (errorData?.msg?.code === 400) {
          setMessage('YouTube API error: Authentication failed. Please try again later or contact support.');
        } else {
          setMessage(errorData?.message || errorData?.error || 'Error uploading file to YouTube');
        }
      } else if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage('Error uploading file');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Upload Video</h2>
      
      {message && (
        <div className={`p-3 rounded-md ${
          message.includes('successfully') 
            ? 'bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-200' 
            : message.includes('YouTube') || message.includes('authentication') || message.includes('expired')
            ? 'bg-orange-100 border border-orange-400 text-orange-700 dark:bg-orange-900 dark:border-orange-600 dark:text-orange-200'
            : 'bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-600 dark:text-red-200'
        }`}>
          <div className="flex items-start">
            {message.includes('YouTube') || message.includes('authentication') || message.includes('expired') ? (
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : message.includes('successfully') ? (
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-sm">{message}</span>
          </div>
        </div>
      )}

      <div className="">
        <label htmlFor="title" className="block text-gray-700 dark:text-gray-300">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:text-white"
          required
          disabled={loading}
        />
      </div>
      <div className="">
        <label htmlFor="description" className="block text-gray-700 dark:text-gray-300">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:text-white"
          required
          disabled={loading}
        />
      </div>
      <div className="">
        <label htmlFor="faculty" className="block text-gray-700 dark:text-gray-300">Faculty</label>
        <select
          id="faculty"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:text-white"
          required
          disabled={loading}
        >
          <option value="">Select Faculty</option>
          <option value="Engineering">Engineering</option>
          <option value="Arts">Arts</option>
          <option value="Science">Science</option>
          <option value="Medicine">Medicine</option>
          <option value="Law">Law</option>
        </select>
      </div>
      <div className="">
        <label htmlFor="video" className="block text-gray-700 dark:text-gray-300">Video File</label>
        <input
          type="file"
          id="video"
          accept="video/*"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="w-full text-gray-700 dark:text-gray-300"
          required
          disabled={loading}
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};

export default UploadForm; 