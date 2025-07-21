// src/hooks/useVideoEditor.ts
import { useState, useRef, useEffect, useCallback } from "react";

interface VideoEditorState {
  videoFile: File | null;
  thumbnail: File | null;
  muted: boolean;
  startTime: number;
  endTime: number | null;
  duration: number;
  isProcessing: boolean;
  error: string | null;
  previewUrl: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

interface VideoEditorActions {
  handleVideoSelect: (file: File) => void;
  handleMuteToggle: () => void;
  handleTrimChange: (start: number, end: number) => void;
  handleTimeUpdate: (currentTime: number) => void;
  generateThumbnail: (time?: number) => Promise<void>;
  getTrimmedBlob: () => Promise<Blob>;
  reset: () => void;
  setError: (error: string | null) => void;
}

const useVideoEditor = (): VideoEditorState & VideoEditorActions => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [muted, setMuted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleVideoSelect = useCallback((file: File) => {
    try {
      setError(null);
      
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }

      // Note: File size validation removed - no maximum limit
      // Users are advised that larger files may take longer to upload depending on network

    setVideoFile(file);
      
      // Create preview URL
    const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Get video duration
      const video = document.createElement('video');
    video.src = url;
      video.onloadedmetadata = () => {
        setDuration(video.duration);
        setEndTime(video.duration);
        // Generate thumbnail at 1 second
        generateThumbnail(1);
      };
      video.onerror = () => {
        setError('Failed to load video file');
      };
    } catch (err) {
      setError('Error processing video file');
      console.error('Video selection error:', err);
    }
  }, []);

  const generateThumbnail = useCallback(async (time: number = 1) => {
    if (!videoFile || !previewUrl) return;

    try {
      setIsProcessing(true);
      setError(null);

      const video = document.createElement('video');
      video.src = previewUrl;
      video.crossOrigin = 'anonymous';
      video.muted = true;

      await new Promise<void>((resolve, reject) => {
        video.onloadeddata = () => resolve();
        video.onerror = () => reject(new Error('Failed to load video'));
        video.load();
      });

      video.currentTime = Math.min(time, video.duration);

      await new Promise<void>((resolve, reject) => {
        video.onseeked = () => resolve();
        video.onerror = () => reject(new Error('Failed to seek video'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
        canvas.toBlob((blob) => {
          if (blob) {
            const thumb = new File([blob], "thumbnail.png", {
              type: "image/png",
            });
            setThumbnail(thumb);
          }
      }, 'image/png', 0.8);

    } catch (err) {
      setError('Failed to generate thumbnail');
      console.error('Thumbnail generation error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [videoFile, previewUrl]);

  const handleMuteToggle = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  const handleTrimChange = useCallback((start: number, end: number) => {
    if (start < 0) start = 0;
    if (end > duration) end = duration;
    if (start >= end) return;

    setStartTime(start);
    setEndTime(end);
  }, [duration]);

  const handleTimeUpdate = useCallback((currentTime: number) => {
    // This can be used for real-time preview updates
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
    }
  }, []);

  const getTrimmedBlob = useCallback(async (): Promise<Blob> => {
    if (!videoFile || !previewUrl) {
      throw new Error('No video selected');
    }

    return new Promise((resolve, reject) => {
      try {
        setIsProcessing(true);
        setError(null);

        const video = document.createElement('video');
        video.src = previewUrl;
      video.muted = true;
        video.crossOrigin = 'anonymous';

      video.onloadedmetadata = () => {
          const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context error'));
            return;
          }

          const stream = canvas.captureStream(30); // 30 FPS
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9'
          });
          
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const trimmedBlob = new Blob(chunks, { type: 'video/webm' });
            setIsProcessing(false);
          resolve(trimmedBlob);
        };

          mediaRecorder.onerror = () => {
            setIsProcessing(false);
            reject(new Error('Media recording failed'));
          };

        video.currentTime = startTime;
        video.play();

        const interval = setInterval(() => {
            if (video.paused || video.ended) {
              clearInterval(interval);
              mediaRecorder.stop();
              return;
            }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
          if (endTime && video.currentTime >= endTime) {
            video.pause();
              clearInterval(interval);
            mediaRecorder.stop();
          }
          }, 1000 / 30); // 30 FPS

        mediaRecorder.start();
      };

        video.onerror = () => {
          setIsProcessing(false);
          reject(new Error('Failed to load video for processing'));
        };

      } catch (err) {
        setIsProcessing(false);
        reject(err);
      }
    });
  }, [videoFile, previewUrl, startTime, endTime]);

  const reset = useCallback(() => {
    setVideoFile(null);
    setThumbnail(null);
    setMuted(false);
    setStartTime(0);
    setEndTime(null);
    setDuration(0);
    setIsProcessing(false);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  return {
    // State
    videoFile,
    thumbnail,
    muted,
    startTime,
    endTime,
    duration,
    isProcessing,
    error,
    previewUrl,
    videoRef,
    
    // Actions
    handleVideoSelect,
    handleMuteToggle,
    handleTrimChange,
    handleTimeUpdate,
    generateThumbnail,
    getTrimmedBlob,
    reset,
    setError,
  };
};

export default useVideoEditor;
