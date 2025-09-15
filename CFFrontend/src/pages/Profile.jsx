import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import { 
  User, Mail, PieChart, Calendar, Award, Shield, Edit3, Code, Trophy, 
  Star, Clock, TrendingUp, Settings, ArrowLeft, Crown, CheckCircle, 
  XCircle, Clock as ClockIcon, ChevronDown, ChevronUp, Download
} from 'lucide-react';

const Profile = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [submissionFilters, setSubmissionFilters] = useState({
    status: '',
    language: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get('/user/getUserInfo');
        setUser(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchUserData();
    }
  }, [authUser]);

  useEffect(() => {
    if (activeTab === 'activity' && user) {
      fetchSubmissions();
    }
  }, [activeTab, user, submissionFilters]);

  const fetchSubmissions = async () => {
    try {
      setSubmissionsLoading(true);
      const params = new URLSearchParams(submissionFilters);
      const { data } = await axiosClient.get(`/problem/my-submissions?${params}`);
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setSubmissions([]);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setSubmissionFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleSubmissionExpansion = (id) => {
    if (expandedSubmission === id) {
      setExpandedSubmission(null);
    } else {
      setExpandedSubmission(id);
    }
  };

  const downloadCode = (code, filename) => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <ClockIcon size={16} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <div className="text-gray-400">{error}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-400">No user data found</div>
      </div>
    );
  }

  // Calculate user stats
  const problemsSolved = user.problemSolved?.length || 0;
  const memberSince = new Date(user.createdAt).toLocaleDateString();
  const daysSinceJoined = Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111111] to-[#1a1a1a] py-12 px-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        <div className="max-w-6xl flex justify-between mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-yellow-500 rounded-full p-2" onClick={() => navigate(`/editprofile`)}>
                <Edit3 size={16} className="text-black" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                {user.firstName} {user.lastName}
                {user.isPaid && (
                  <Crown size={24} className="text-yellow-500 fill-yellow-500" />
                )}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail size={16} />
                  <span>{user.emailId}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  <span>Joined {memberSince}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Shield size={16} />
                  <span className="capitalize">{user.role}</span>
                </div>
                {user.isPaid && (
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Crown size={16} className="fill-yellow-500" />
                    <span>Premium Member</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg border border-gray-800">
                  <div className="text-2xl font-bold text-yellow-500">{problemsSolved}</div>
                  <div className="text-sm text-gray-400">Problems Solved</div>
                </div>
                <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg border border-gray-800">
                  <div className="text-2xl font-bold text-yellow-500">{daysSinceJoined}</div>
                  <div className="text-sm text-gray-400">Days Active</div>
                </div>
              </div>
            </div>
            
          </div>
          {/* Circular Progress Bar */}
          <div className="relative flex flex-col gap-2 items-center justify-center">
            <div className="w-40 h-40 rounded-full flex items-center justify-center relative">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
              
              {/* Progress circle - using conic-gradient for the pie chart effect */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    #FFD33D 0% ${(problemsSolved / 10) * 100}%, 
                    transparent ${(problemsSolved / 10) * 100}% 100%
                  )`
                }}
              ></div>
              
              {/* Inner circle to create the ring effect */}
              <div className="absolute inset-2 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg flex font-bold text-yellow-500">{problemsSolved}<p className='text-white'>/10</p></div>
                </div>
              </div>
            </div>
          
            <p className='text-xl flex gap-2 items-center font-bold text-yellow-300'> Progress Circle  <TrendingUp size={35} className='text-white'/></p>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex border-b border-gray-800 mb-8">
          {['overview', 'activity', 'achievements', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                activeTab === tab
                  ? 'border-b-2 border-yellow-500 text-yellow-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab === 'overview' && <User size={16} />}
              {tab === 'activity' && <TrendingUp size={16} />}
              {tab === 'achievements' && <Trophy size={16} />}
              {tab === 'settings' && <Settings size={16} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
  
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Info Card */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">First Name</label>
                  <p className="text-white">{user.firstName}</p>
                </div>
                {user.lastName && (
                  <div>
                    <label className="text-sm text-gray-400">Last Name</label>
                    <p className="text-white">{user.lastName}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-white">{user.emailId}</p>
                </div>
                {user.age && (
                  <div>
                    <label className="text-sm text-gray-400">Age</label>
                    <p className="text-white">{user.age} years</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-400">Role</label>
                  <p className="capitalize text-white">{user.role}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Member Since</label>
                  <p className="text-white">{memberSince}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Account Status</label>
                  <p className="flex items-center gap-2">
                    <span className="text-white">{user.isPaid ? 'Premium' : 'Free'}</span>
                    {user.isPaid && <Crown size={16} className="text-yellow-500 fill-yellow-500" />}
                  </p>
                </div>
              </div>
            </div>
  
            {/* Stats Card */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Coding Statistics
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code size={20} className="text-yellow-500" />
                    <span>Problems Solved</span>
                  </div>
                  <span className="text-yellow-500 font-bold">{problemsSolved}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={20} className="text-yellow-500" />
                    <span>Days Active</span>
                  </div>
                  <span className="text-yellow-500 font-bold">{daysSinceJoined}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-yellow-500" />
                    <span>Success Rate</span>
                  </div>
                  <span className="text-yellow-500 font-bold">
                    {problemsSolved > 0 ? `${Math.min(95, Math.floor((problemsSolved / (problemsSolved + 10)) * 100))}%` : '0%'}
                  </span>
                </div>
                
                <div className="bg-[#252525] p-4 rounded-lg mt-4">
                  <div className="text-sm text-gray-400 mb-2">Current Streak</div>
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      0 days
                    </div>
                    <span className="text-sm text-gray-400">Keep going!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {activeTab === 'activity' && (
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              
              <div className="flex gap-4">
                <select 
                  value={submissionFilters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
                >
                  <option value="">All Status</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                </select>
                
                <select 
                  value={submissionFilters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
                >
                  <option value="">All Languages</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
                
                <select 
                  value={submissionFilters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
            
            {submissionsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-gray-400 text-center py-12">
                <Code size={48} className="mx-auto mb-4 text-gray-600" />
                <p>No submissions yet</p>
                <p className="text-sm mt-2">Your submissions will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission._id} className="bg-black p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-gray-200 font-medium">
                          {submission.problemId?.title || 'Unknown Problem'}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className={`flex items-center gap-1 ${getStatusColor(submission.status)}`}>
                            {getStatusIcon(submission.status)}
                            {submission.status}
                          </span>
                          <span className="text-gray-400">{submission.language}</span>
                          <span className="text-gray-400">{formatDate(submission.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span>Runtime: {submission.runtime}s</span>
                          <span>Memory: {submission.memory}KB</span>
                          <span>
                            {submission.testCasesPassed}/{submission.testCasesTotal} test cases passed
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadCode(submission.code, `solution-${submission._id}.${submission.language}`)}
                          className="p-2 text-gray-400 hover:text-white"
                          title="Download code"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => toggleSubmissionExpansion(submission._id)}
                          className="p-2 text-gray-400 hover:text-white"
                        >
                          {expandedSubmission === submission._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>
                    
                    {expandedSubmission === submission._id && (
                      <div className="mt-4">
                        {submission.errorMessage && (
                          <div className="mb-4 p-3 bg-red-900/20 rounded-md">
                            <p className="text-red-400 text-sm">{submission.errorMessage}</p>
                          </div>
                        )}
                        
                        <div className="bg-gray-900 p-4 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-300">Code</h4>
                            <span className="text-xs text-gray-500 uppercase">{submission.language}</span>
                          </div>
                          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                            <code className="text-gray-300">{submission.code}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
  
        {activeTab === 'achievements' && (
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#252525] p-4 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-yellow-500/20 p-2 rounded-full">
                    <Trophy size={20} className="text-yellow-500" />
                  </div>
                  <h3 className="font-semibold">First Steps</h3>
                </div>
                <p className="text-sm text-gray-400">Solve your first problem</p>
                <div className="mt-3 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: problemsSolved > 0 ? '100%' : '0%' }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {problemsSolved > 0 ? 'Completed' : '0/1 problems'}
                </div>
              </div>
  
              <div className="bg-[#252525] p-4 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-yellow-500/20 p-2 rounded-full">
                    <Code size={20} className="text-yellow-500" />
                  </div>
                  <h3 className="font-semibold">Code Apprentice</h3>
                </div>
                <p className="text-sm text-gray-400">Solve 10 problems</p>
                <div className="mt-3 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (problemsSolved / 10) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {problemsSolved >= 10 ? 'Completed' : `${problemsSolved}/10 problems`}
                </div>
              </div>
  
              <div className="bg-[#252525] p-4 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-yellow-500/20 p-2 rounded-full">
                    <Award size={20} className="text-yellow-500" />
                  </div>
                  <h3 className="font-semibold">Coding Master</h3>
                </div>
                <p className="text-sm text-gray-400">Solve 50 problems</p>
                <div className="mt-3 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (problemsSolved / 50) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {problemsSolved >= 50 ? 'Completed' : `${problemsSolved}/50 problems`}
                </div>
              </div>
            </div>
          </div>
        )}
  
        {activeTab === 'settings' && (
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="text-gray-400 text-center py-8">
              <Settings size={48} className="mx-auto mb-4 text-gray-600" />
              <p>Settings feature coming soon</p>
              <p className="text-sm mt-2">You'll be able to update your profile and preferences here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;