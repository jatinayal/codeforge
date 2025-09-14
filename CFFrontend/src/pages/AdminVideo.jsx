import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { Upload, Trash2, Eye, Loader, ArrowLeft, Video, Play, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, problem: null });
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/problem/getAllproblem');
      setProblems(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching problems:', err);
      setError('Failed to fetch problems. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (problemId) => {
    navigate(`/problem/upload/${problemId}`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosClient.delete(`/video/delete/${deleteModal.problem._id}`);
      alert('Video deleted successfully!');
      setDeleteModal({ isOpen: false, problem: null });
      fetchProblems(); // Refresh the list
    } catch (err) {
      console.error('Error deleting video:', err);
      alert('Failed to delete video. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (problem) => {
    setDeleteModal({ isOpen: true, problem });
  };

  const closeModal = () => {
    setDeleteModal({ isOpen: false, problem: null });
  };

  const DifficultyBadge = ({ difficulty }) => {
    const colorMap = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[difficulty]}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  const TagBadge = ({ tag }) => {
    return (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
        {tag}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="w-8 h-8 animate-spin text-blue-500 mb-2" />
          <p className="text-gray-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Manage Video Solutions</h1>
          </div>
          <p className="text-gray-600">{problems.length} problem(s) found</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {problems.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Problems Found</h3>
            <p className="text-gray-500">There are no problems to display at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {problems.map((problem) => (
              <div key={problem._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{problem.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{problem.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <DifficultyBadge difficulty={problem.difficulty} />
                      <TagBadge tag={problem.tags} />
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-4">
                      ID: {problem._id}
                    </div>

                    {problem.videoSolution && (
                      <div className="flex items-center text-green-600 mb-4">
                        <Video className="w-4 h-4 mr-1" />
                        <span>Video solution available</span>
                        <a 
                          href={problem.videoSolution.secureUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Watch
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={() => handleUpload(problem._id)}
                      className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      {problem.videoSolution ? 'Replace Video' : 'Upload Video'}
                    </button>
                    
                    {problem && (
                      <button
                        onClick={() => openDeleteModal(problem)}
                        className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete Video
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Video Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-red-100 p-2 mr-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Video</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the video solution for <strong>"{deleteModal.problem?.title}"</strong>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {deleting ? (
                    <>
                      <Loader className="w-4 h-4 mr-1 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete Video
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideo;