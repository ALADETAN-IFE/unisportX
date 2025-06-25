import React from 'react';
import UploadForm from '../components/UploadForm';
import VideoGrid from '../components/VideoGrid';

const DashboardPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <UploadForm />
        </div>
        <div className="md:col-span-2">
          <VideoGrid />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 