import React, { useState, useEffect } from 'react';
import axios from 'axios';
import customAxios from '../api/axiosInstance.ts';
import { toast } from 'react-toastify';
// import { facultyOptions } from "../utils/datas"
import useVideoEditor from '../hooks/useVideoEditor';
import { fetchCountries, fetchUniversities, type Country, type University } from '../utils/universitySelector';
import Select from 'react-select';
import { selectCustomStyles } from '../utils/reactSelectStyle';

const eventTypeOptions = [
  'Inter-University',
  'Intra-University',
  'Hostel Game',
  'Training',
  'General',
];

const IntraUniversityOptions = [
  'HOD Game',
  'Deans Game',
  "VC's Game",
  'Freshers Game',
  'Not here'
]

const UploadForm = ({ setLoadVideos, onSuccess }: { setLoadVideos: (loadVideos: boolean)=> void; onSuccess?: () => void; }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolDepartment, setSchoolDepartment] = useState('');
  const [schoolFaculty, setSchoolFaculty] = useState('');
  // const [schoolCampus, setSchoolCampus] = useState('');
  const [eventType, setEventType] = useState('General');
  const [intraUniversityType, setIntraUniversityType] = useState('');
  const [intraUniversityTypeNotHere, setIntraUniversityTypeNotHere] = useState(false);
  const [participants, setParticipants] = useState(''); // JSON or comma-separated
  const [tags, setTags] = useState(''); // comma-separated
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  // University selector states
  const [countries, setCountries] = useState<Country[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [error, setError] = useState('');
  // const [file, setFile] = useState<File | null>(null);

  const {
    videoFile,
    thumbnail,
    muted,
    startTime,
    endTime,
    duration,
    isProcessing,
    error: videoError,
    previewUrl,
    videoRef,
    handleVideoSelect,
    handleMuteToggle,
    handleTrimChange,
    generateThumbnail,
    getTrimmedBlob,
    reset,
    // setError,
  } = useVideoEditor();

  // Fetch countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      setLoadingCountries(true);
      try {
        const countriesData = await fetchCountries();
        setCountries(countriesData);
      } catch (err) {
        setError('Could not load countries.');
        console.error('Failed to fetch countries', err);
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  // Fetch universities when country changes
  useEffect(() => {
    const loadUniversities = async () => {
      if (!country) {
        setUniversities([]);
        return;
      }

      setLoadingUniversities(true);
      try {
        const universitiesData = await fetchUniversities(country);
        setUniversities(universitiesData);
      } catch (err) {
        setError('Could not load universities.');
        console.error('Failed to fetch universities', err);
      } finally {
        setLoadingUniversities(false);
      }
    };

    loadUniversities();
  }, [country]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!file) {
    //   setMessage('Please select a file');
    if (!videoFile) {
      setMessage('Please select a video file');
      return;
    }

    if (videoError) {
      setMessage(videoError);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('country', country);
      formData.append('schoolName', schoolName);
      if(schoolDepartment){
        formData.append('schoolDepartment', schoolDepartment);
      }
      formData.append('schoolFaculty', schoolFaculty);
      // formData.append('schoolCampus', schoolCampus);
      // Format event type for Intra-University
      const formattedEventType = eventType === 'Intra-University' && intraUniversityType 
        ? `${eventType}(${intraUniversityType})` 
        : eventType;
      formData.append('eventType', formattedEventType);
      
      formData.append('tags', tags);
      if (participants) {
        formData.append('participants', participants);
      }
      // formData.append('video', file);

      // Use trimmed video if trimming is applied
      if (startTime > 0 || (endTime && endTime < duration)) {
        const trimmedBlob = await getTrimmedBlob();
        const processedFile = new File([trimmedBlob], "processed-video.webm", { type: "video/webm" });
        formData.append('video', processedFile);
      } else {
        formData.append('video', videoFile);
      }

      // Add thumbnail if available
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      const res = await customAxios.post(`/videos/upload-youtube`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log('File uploaded successfully:', res.data);
      setMessage('File uploaded successfully!');
      setLoadVideos(true);
      toast.success('Video uploaded successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setCountry('');
      setSchoolName('');
      setSchoolDepartment('');
      setSchoolFaculty('');
      // setSchoolCampus('');
      setEventType('General');
      setIntraUniversityType('');
      setParticipants('');
      setTags('');
      reset();
      
      // Close modal if onSuccess callback is provided
      if (onSuccess) {
        onSuccess();
      }
      
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    // <form onSubmit={handleSubmit} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md flex flex-col gap-4">
    // <h2 className="text-xl font-bold text-gray-800 dark:text-white">Upload Video</h2>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Remove the header since it's now in the modal */}
      
      {message && (
        <div className={`p-3 rounded-md ${
          message.includes('successfully') 
            ? 'bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-200' 
            : message.includes('YouTube') || message.includes('authentication') || message.includes('expired')
            ? 'bg-orange-100 border border-orange-400 text-orange-700 dark:bg-orange-900 dark:border-orange-600 dark:text-orange-200'
            : 'bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-600 dark:text-red-200'
        }`}>
          <span className="text-sm">{message}</span>
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
          disabled={loading || isProcessing}
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
          disabled={loading || isProcessing}
        />
      </div>
      <div className="">
        <label htmlFor="country" className="block text-gray-700 dark:text-gray-300">Country</label>
        <select
          id="country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setSchoolName(''); // Reset school when country changes
          }}
          className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:text-white"
          required
          disabled={loading || isProcessing || loadingCountries}
        >
          <option value="">-- Select Country --</option>
          {countries.map((countryOption) => (
            <option key={countryOption.id} value={countryOption.name}>
              {countryOption.name}
            </option>
          ))}
        </select>
        {loadingCountries && <p className="text-xs text-gray-500 mt-1">Loading countries...</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label htmlFor="schoolName" className="block text-gray-700 dark:text-gray-300">School Name</label>
          <Select
            id="schoolName"
            value={universities.find(uni => uni.name === schoolName) || null}
            onChange={option => setSchoolName(option ? option.name : '')}
            options={universities}
            getOptionLabel={option => option.name}
            getOptionValue={option => option.name}
            isDisabled={loading || isProcessing || loadingUniversities || !country}
            placeholder="- Select University -"
            isClearable
            required
            styles={selectCustomStyles}
          />
          {loadingUniversities && <p className="text-xs text-gray-500 mt-1">Loading universities...</p>}
        </div>
        <div>
          <label htmlFor="schoolFaculty" className="block text-gray-700 dark:text-gray-300">Faculty</label>
          <input
            type="text"
            id="schoolFaculty"
            value={schoolFaculty}
            onChange={(e) => setSchoolFaculty(e.target.value)}
            className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:text-white"
            disabled={loading || isProcessing}
          />
        </div>
        <div>
          <label htmlFor="schoolDepartment" className="block text-gray-700 dark:text-gray-300">Department</label>
          <input
            type="text"
            id="schoolDepartment"
            value={schoolDepartment}
            onChange={(e) => setSchoolDepartment(e.target.value)}
            className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:text-white"
            disabled={loading || isProcessing}
          />
        </div>
        {/* <div>
          <label htmlFor="schoolCampus" className="block text-gray-700 dark:text-gray-300">Campus</label>
          <input
            type="text"
            id="schoolCampus"
            value={schoolCampus}
            onChange={(e) => setSchoolCampus(e.target.value)}
            className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:text-white"
            disabled={loading || isProcessing}
          />
        </div> */}
      </div>
      <div className="">
        <label htmlFor="eventType" className="block text-gray-700 dark:text-gray-300">Event Type</label>
        <select
          id="eventType"
          value={eventType}
          onChange={(e) => {
            setEventType(e.target.value);
            if (e.target.value !== 'Intra-University') {
              setIntraUniversityType('');
            }
          }}
          className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:text-white"
          required
          disabled={loading || isProcessing}
        >
          {eventTypeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Intra-University Type Input */}
      {eventType === 'Intra-University' && (
        <div className="">
          <label htmlFor="intraUniversityType" className="block text-gray-700 dark:text-gray-300">
            Intra-University Type
          </label>
          {
            intraUniversityTypeNotHere ?  
            <input
              type="text"
              id="intraUniversityType"
              value={intraUniversityType}
              onChange={(e) => setIntraUniversityType(e.target.value)}
              className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:text-white"
              placeholder="HOD Game, Deans Game, VC's Game, Freshers Game"
              required
              disabled={loading || isProcessing}
            />
            : 
           <select
            id="intraUniversityType"
            value={intraUniversityType}
            onChange={(e) => {
              if(e.target.value === 'Not here'){
                setIntraUniversityTypeNotHere(true)
              } else{
                setIntraUniversityType(e.target.value)
              }
            }}
            className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:text-white"
            required
            disabled={loading || isProcessing}
            >
          {IntraUniversityOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
          }
        </div>
      )}
      <div className="">
        <label htmlFor="participants" className="block text-gray-700 dark:text-gray-300">Participants (JSON or comma-separated)</label>
        <textarea
          id="participants"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:text-white"
          placeholder='[{"name":"John Doe","school":"UNILAG","country":"Nigeria"}] or name1,school1,country1;name2,school2,country2'
          rows={2}
          disabled={loading || isProcessing}
        />
      </div>
      <div className="">
        <label htmlFor="tags" className="block text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:text-white"
          placeholder="e.g. football, finals, 2024"
          disabled={loading || isProcessing}
        />
      </div>
      <div className="">
        <label htmlFor="video" className="block text-gray-700 dark:text-gray-300">Video File</label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            
            const files = Array.from(e.dataTransfer.files);
            const videoFile = files.find(file => file.type.startsWith('video/'));
            
            if (videoFile) {
              handleVideoSelect(videoFile);
            } else {
              setMessage('Please drop a valid video file.');
            }
          }}
        >
          <div className="space-y-2">
            <svg 
              className={`mx-auto h-12 w-12 ${
                isDragOver ? 'text-blue-500' : 'text-gray-400'
              }`} 
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 48 48"
            >
              <path 
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            <div className="text-sm">
              <label htmlFor="video" className="relative cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                <span>Choose a video file</span>
                <input
                  type="file"
                  id="video"
                  accept="video/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleVideoSelect(e.target.files[0]);
                    }
                  }}     
                  className="sr-only"
                  required
                  disabled={loading || isProcessing}
                />
              </label>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                or drag and drop
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              MP4, WebM, MOV up to 100MB recommended
            </p>
          </div>
        </div>
      </div>

      {/* Video Preview and Editor */}
      {videoFile && (
        <>
          {console.log('Video preview debug:', { videoFile: !!videoFile, previewUrl: !!previewUrl, videoFileName: videoFile?.name })}
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white">Video Editor</h3>
            
            {/* Video Preview */}
            <div className="relative">
              {previewUrl ? (
                <video
                  ref={videoRef}
                  src={previewUrl}
                  controls
                  className="w-full rounded-md"
                  muted={muted}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading video preview...</p>
                  </div>
                </div>
              )}
              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p>Processing video...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls */}
            {/* Mute Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={muted} 
                onChange={handleMuteToggle}
                className="rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Mute Video</span>
            </label>
            {/* Trim Controls */}
            {duration > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trim Video ({formatTime(startTime)} - {formatTime(endTime || duration)})
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400">Start Time</label>
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      step={0.1}
                      value={startTime}
                      onChange={(e) => handleTrimChange(Number(e.target.value), endTime || duration)}
                      className="w-full"
                      disabled={isProcessing}
                    />
                    <span className="text-xs text-gray-500">{formatTime(startTime)}</span>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400">End Time</label>
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      step={0.1}
                      value={endTime || duration}
                      onChange={(e) => handleTrimChange(startTime, Number(e.target.value))}
                      className="w-full"
                      disabled={isProcessing}
                    />
                    <span className="text-xs text-gray-500">{formatTime(endTime || duration)}</span>
                  </div>
                </div>
              </div>
            )}
            {/* Thumbnail Generation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => generateThumbnail()}
                disabled={isProcessing}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Generate Thumbnail
              </button>
              {thumbnail && (
                <span className="text-xs text-green-600 dark:text-green-400">
                  ✓ Thumbnail ready
                </span>
              )}
            </div>
          </div>
        </>
      )}

      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        disabled={loading || isProcessing || !videoFile}
      >
        {loading ? 'Uploading...' : isProcessing ? 'Processing...' : 'Upload'}
      </button>

      {videoError && (
        <div className="p-3 rounded-md bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-600 dark:text-red-200">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{videoError}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-md bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-600 dark:text-red-200">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}
    </form>
  );
};

export default UploadForm; 