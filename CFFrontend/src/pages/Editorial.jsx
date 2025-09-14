import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Clock, 
  User, 
  ThumbsUp, 
  MessageSquare, 
  Eye,
  Maximize,
  Settings
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { useParams } from 'react-router-dom';

const Editorial = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const { problemId } = useParams();
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);
  
  useEffect(() => {
    const fetchProblemWithVideo = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/problembyid/${problemId}`);
        setVideoData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching problem with video:', err);
        setError('Failed to load video solution');
      } finally {
        setLoading(false);
      }
    };

    if (problemId) {
      fetchProblemWithVideo();
    }
  }, [problemId]);

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper function to extract URL from Cloudinary img tag
  const extractCloudinaryUrl = (imgTag) => {
    if (!imgTag) return null;
    
    // If it's already a URL, return it directly
    if (imgTag.startsWith('http')) return imgTag;
    
    // Extract URL from img tag using regex
    const match = imgTag.match(/src='([^']*)'/);
    return match ? match[1] : null;
  };

  // Video control functions
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgress = () => {
    if (videoRef.current && videoRef.current.duration) {
      const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percent);
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * videoRef.current.duration;
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.parentElement.requestFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  if (loading) {
    return (
      <div className="bg-base-200 rounded-lg p-6 text-center">
        <div className="animate-pulse">
          <div className="bg-base-300 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"></div>
          <div className="h-4 bg-base-300 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-base-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-base-200 rounded-lg p-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Eye size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-base-content mb-2">Error Loading Video</h3>
          <p className="text-base-content/70 mb-4">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!videoData?.secureUrl) {
    return (
      <div className="bg-base-200 rounded-lg p-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-base-300 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Play size={24} className="text-base-content/60" />
          </div>
          <h3 className="text-lg font-medium text-base-content mb-2">No Video Solutions Yet</h3>
          <p className="text-base-content/70 mb-4">
            Video solutions are comming soon...
          </p>
          <button className="btn btn-primary btn-sm">
            Horrayyy!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="bg-base-100 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-3xl">
        <div 
          className="relative aspect-video bg-black group"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            if (isPlaying) {
              controlsTimeout.current = setTimeout(() => {
                setShowControls(false);
              }, 1000);
            }
          }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            poster={extractCloudinaryUrl(videoData.thumbnailUrl)}
            onTimeUpdate={handleProgress}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
          >
            <source src={videoData.secureUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Big Play Button (shown when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300">
              <button 
                className="btn btn-circle btn-lg bg-white/20 hover:bg-white/30 border-0 backdrop-blur-sm transition-transform duration-200 hover:scale-110"
                onClick={togglePlay}
              >
                <Play size={32} className="text-white" fill="white" />
              </button>
            </div>
          )}

          {/* Custom Video Controls */}
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress Bar */}
            <div 
              className="w-full h-2 bg-white/30 rounded-full mb-3 cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-primary rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg"></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  className="btn btn-ghost btn-sm text-white hover:bg-white/20"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <button 
                  className="btn btn-ghost btn-sm text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <div className="text-white text-sm">
                  {videoRef.current && formatDuration(videoRef.current.currentTime)} / 
                  {videoRef.current && formatDuration(videoRef.current.duration)}
                </div>
              </div>

              <div className="flex items-center space-x-2">
               
                <button 
                  className="btn btn-ghost btn-sm text-white hover:bg-white/20"
                  onClick={toggleFullscreen}
                >
                  <Maximize size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Video Info */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-base-content mb-3">{videoData.title || "Solution Walkthrough"}</h2>
          
          <div className="flex items-center text-sm text-base-content/70 mb-4">
            <User size={18} className="mr-2" />
            <span className="mr-4 font-medium">{videoData.uploader || "CodingExpert123"}</span>
            <span className="mr-4">• {videoData.views || "1.2K"} views</span>
            <span>• {videoData.uploadDate || "2 days ago"}</span>
          </div>
          
          <p className="text-base-content/80 mb-6 p-4 bg-base-200 rounded-lg">
            {videoData.description || "In this video, I walk through the optimal solution for this problem with detailed explanations of the approach and time complexity analysis."}
          </p>
          
          {/* Engagement Buttons */}
          <div className="flex space-x-4 border-t border-base-300 pt-4">
            <button className="btn btn-outline btn-sm gap-2">
              <ThumbsUp size={18} />
              <span>{videoData.likes || 24}</span>
            </button>
            <button className="btn btn-outline btn-sm gap-2">
              <MessageSquare size={18} />
              <span>{videoData.comments || 5}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editorial;