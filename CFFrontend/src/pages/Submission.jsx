import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { useParams } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Code, 
  Calendar, 
  Cpu, 
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Play
} from 'lucide-react';

const Submission = ({pid}) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedSubmission, setExpandedSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [pid]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/problem/submittedProblem/${pid}`);
      
      if (response.data === "No Submission is Present") {
        setSubmissions([]);
      } else {
        setSubmissions(response.data);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to fetch submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
    setCopied(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const copyCode = () => {
    if (selectedSubmission) {
      navigator.clipboard.writeText(selectedSubmission.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleExpandSubmission = (id) => {
    if (expandedSubmission === id) {
      setExpandedSubmission(null);
    } else {
      setExpandedSubmission(id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatMemory = (memoryKB) => {
    if (memoryKB < 1024) return `${memoryKB} KB`;
    return `${(memoryKB / 1024).toFixed(2)} MB`;
  };

  const formatRuntime = (runtimeMs) => {
    if (runtimeMs < 1000) return `${runtimeMs} ms`;
    return `${(runtimeMs / 1000).toFixed(2)} s`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'wrong':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'wrong':
        return 'Wrong Answer';
      case 'error':
        return 'Error';
      default:
        return 'Pending';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className=" rounded-lg shadow-md p-6 max-w-md mx-4">
          <div className="text-red-500 mb-4 text-center">{error}</div>
          <button 
            onClick={fetchSubmissions}
            className="btn btn-primary w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#333333] rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-200">Submission History</h1>
            <div className="text-sm text-gray-300">
              {submissions.length} submission{submissions.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Submissions Yet</h3>
              <p className="text-gray-500">You haven't submitted any solutions for this problem yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission._id} className="border rounded-lg overflow-hidden">
                  <div 
                    className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleExpandSubmission(submission._id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-700">
                        {getStatusIcon(submission.status)}
                        <span className="ml-2 font-medium">{getStatusText(submission.status)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-4">
                          {formatDate(submission.createdAt)}
                        </span>
                        {expandedSubmission === submission._id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedSubmission === submission._id && (
                    <div className="p-4 bg-white">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-700">Runtime: {formatRuntime(submission.runtime)}</span>
                        </div>
                        <div className="flex items-center">
                          <Cpu className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-700">Memory: {formatMemory(submission.memory)}</span>
                        </div>
                        <div className="flex items-center">
                          <Code className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm capitalize text-gray-700">{submission.language}</span>
                        </div>
                        <div className="flex items-center">
                          <Play className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {submission.testCasesPassed}/{submission.testCasesTotal} test cases
                          </span>
                        </div>
                      </div>

                      {submission.errorMessage && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                          <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                            <span className="font-medium text-red-800">Error:</span>
                          </div>
                          <p className="text-red-700 mt-1 text-sm">{submission.errorMessage}</p>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          onClick={() => openModal(submission)}
                          className="btn btn-outline bg-gray-700 btn-sm"
                        >
                          View Code
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Code View Modal */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold  text-gray-700">Submission Code</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-900 capitalize">{selectedSubmission.language}</span>
                <button
                  onClick={copyCode}
                  className="btn btn-sm btn-outline bg-black"
                  title="Copy code"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={closeModal}
                  className="btn btn-sm btn-ghost bg-black"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <div className="bg-gray-800 text-gray-100 rounded-md p-4 font-mono text-sm whitespace-pre-wrap overflow-auto">
                {selectedSubmission.code}
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Status:</span>{' '}
                  <span className={selectedSubmission.status === 'accepted' ? 'text-green-600' : 'text-red-600'}>
                    {getStatusText(selectedSubmission.status)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Runtime:</span> <span className=' text-gray-700'>{formatRuntime(selectedSubmission.runtime)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Memory:</span> <span className=' text-gray-700'>{formatMemory(selectedSubmission.memory)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Submitted:</span> <span className=' text-gray-700'>{formatDate(selectedSubmission.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submission;