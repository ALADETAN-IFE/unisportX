import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [title, setTitle] = useState('');
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
    formData.append('faculty', faculty);
    formData.append('video', file);

    try {
      const res = await axios.post('http://localhost:5000/api/videos/upload-youtube', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      console.log('File uploaded successfully:', res.data);
      setMessage('File uploaded successfully!');
      setTitle('');
      setFaculty('');
      setFile(null);
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setMessage(err.response?.data?.message || 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Upload Video</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('successfully') 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="mb-4">
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
      <div className="mb-4">
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
      <div className="mb-4">
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