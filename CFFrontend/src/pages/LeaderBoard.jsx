import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, User, Star, TrendingUp, Award, ArrowLeft } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { useNavigate, Link } from 'react-router-dom';

const LeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/user/leaderboard');
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load leaderboard, Try Logging in');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Function to get rank badge based on position
  const getRankBadge = (index) => {
    if (index === 0) return <Crown className="text-yellow-500" size={24} />;
    if (index === 1) return <Medal className="text-gray-400" size={24} />;
    if (index === 2) return <Medal className="text-amber-700" size={24} />;
    return <span className="text-lg font-bold text-gray-400">{index + 1}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a]">
        <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] py-8 px-10">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>
      
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="text-yellow-500 mr-3" size={32} />
            <h1 className="text-3xl font-bold text-white">CodeForge Leaderboard</h1>
          </div>
          <p className="text-gray-400">Top coders based on problems solved</p>
        </div>

        {/* Leaderboard */}
        <div className="bg-[#0a0a0a] border border-[#333333] rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-[#111111] border-b border-[#333333] px-6 py-4 text-gray-400 font-semibold text-sm">
            <div className="col-span-1">Rank</div>
            <div className="col-span-7">User</div>
            <div className="col-span-2 text-center">Solved</div>
            <div className="col-span-2 text-center">Activity</div>
          </div>

          {/* User List */}
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No users found on the leaderboard</p>
            </div>
          ) : (
            users.map((user, index) => (
              <div
                key={user._id}
                className={`grid grid-cols-12 px-6 py-4 border-b border-[#333333] last:border-b-0 hover:bg-[#111111] transition-colors ${
                  index < 3 ? 'bg-[#0f0f0f]' : ''
                }`}
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getRankBadge(index)}
                  </div>
                </div>

                {/* User Info with Link to Profile */}
                <div className="col-span-7 flex items-center">
                  <Link 
                    to={`/profile/${user._id}`}
                    className="flex items-center hover:opacity-80 transition-opacity"
                  >
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center mr-4">
                        <User className="text-black" size={20} />
                      </div>
                    )}
                    <div>
                      <h3 className="text-white font-medium">
                        {user.firstName} {user.lastName || ''}
                      </h3>
                    </div>
                  </Link>
                </div>

                {/* Problems Solved */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-yellow-500 font-bold text-xl">
                      {user.problemSolvedCount}
                    </div>
                    <div className="text-gray-500 text-xs">problems</div>
                  </div>
                </div>

                {/* Activity */}
                <div className="col-span-2 flex items-center justify-center">
                  {index < 3 ? (
                    <div className="flex items-center bg-yellow-500/10 px-3 py-1 rounded-full">
                      <TrendingUp size={14} className="text-yellow-500 mr-1" />
                      <span className="text-yellow-500 text-sm">Active</span>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'New'}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Summary */}
        {users.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0a0a0a] border border-[#333333] rounded-xl p-4 text-center">
              <div className="text-yellow-500 font-bold text-2xl mb-1">
                {users[0]?.problemSolvedCount || 0}
              </div>
              <div className="text-gray-400 text-sm">Top Score</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[#333333] rounded-xl p-4 text-center">
              <div className="text-white font-bold text-2xl mb-1">
                {users.length}
              </div>
              <div className="text-gray-400 text-sm">Total Players</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[#333333] rounded-xl p-4 text-center">
              <div className="text-white font-bold text-2xl mb-1">
                {users.reduce((sum, user) => sum + user.problemSolvedCount, 0)}
              </div>
              <div className="text-gray-400 text-sm">Total Solutions</div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Leaderboard updates in real-time as users solve problems</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;