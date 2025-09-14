import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Trophy, Zap, Code, Cpu, Database, Network, Award, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

const Contest = () => {
  const [registeredContests, setRegisteredContests] = useState(new Set());
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [contests, setContests] = useState([]);

  useEffect(() => {
    // Generate contests with dates relative to current date
    const now = new Date();
    const generateContests = () => {
      return [
        {
          id: 1,
          name: "CodeForge Weekly Challenge",
          description: "A weekly coding challenge featuring algorithmic problems of varying difficulty levels.",
          startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          duration: "2 hours",
          participants: 1250,
          difficulty: "Medium",
          status: "upcoming",
          topics: ["Algorithms", "Data Structures"],
          prizes: "$1000 in prizes",
          organizer: "CodeForge Team"
        },
        {
          id: 2,
          name: "DSA Master Cup",
          description: "Test your Data Structures and Algorithms knowledge in this intense competition.",
          startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          duration: "3 hours",
          participants: 890,
          difficulty: "Hard",
          status: "upcoming",
          topics: ["Data Structures", "Algorithms", "Complexity Analysis"],
          prizes: "Cash prizes and internship opportunities",
          organizer: "DSA Foundation"
        },
        {
          id: 3,
          name: "JavaScript Ninja Battle",
          description: "A contest focused entirely on JavaScript programming challenges and web development concepts.",
          startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          duration: "2.5 hours",
          participants: 750,
          difficulty: "Medium",
          status: "upcoming",
          topics: ["JavaScript", "Web Development", "DOM Manipulation"],
          prizes: "Premium course subscriptions",
          organizer: "Web Dev Association"
        },
        {
          id: 4,
          name: "AI Programming Challenge",
          description: "Solve problems related to artificial intelligence, machine learning, and neural networks.",
          startTime: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
          duration: "4 hours",
          participants: 620,
          difficulty: "Hard",
          status: "upcoming",
          topics: ["Artificial Intelligence", "Machine Learning", "Python"],
          prizes: "$2000 cash prize",
          organizer: "AI Research Lab"
        },
        {
          id: 5,
          name: "Database Design Derby",
          description: "Competition focused on database design, optimization, and complex query writing.",
          startTime: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
          duration: "3 hours",
          participants: 480,
          difficulty: "Medium",
          status: "upcoming",
          topics: ["SQL", "Database Design", "Query Optimization"],
          prizes: "Licenses for database tools",
          organizer: "Data Management Guild"
        },
        {
          id: 6,
          name: "Dynamic Programming Dash",
          description: "A contest dedicated entirely to dynamic programming problems of increasing difficulty.",
          startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
          duration: "2.5 hours",
          participants: 1100,
          difficulty: "Hard",
          status: "running",
          topics: ["Dynamic Programming", "Algorithms"],
          prizes: "Exclusive coding resources",
          organizer: "Algorithm Masters"
        },
        {
          id: 7,
          name: "System Design Showdown",
          description: "Design scalable systems and architectures for real-world applications.",
          startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
          duration: "4 hours",
          participants: 420,
          difficulty: "Expert",
          status: "running",
          topics: ["System Design", "Scalability", "Architecture"],
          prizes: "Mentorship with industry experts",
          organizer: "System Architects United"
        },
        {
          id: 8,
          name: "Python Pandas Competition",
          description: "Data manipulation and analysis using Python's Pandas library with large datasets.",
          startTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          duration: "3 hours",
          participants: 680,
          difficulty: "Medium",
          status: "past",
          topics: ["Python", "Pandas", "Data Analysis"],
          prizes: "Data science toolkit worth $500",
          organizer: "Data Science Community"
        },
        {
          id: 9,
          name: "Graph Theory Grand Prix",
          description: "Problems focused on graph algorithms, traversal, and optimization techniques.",
          startTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          duration: "3 hours",
          participants: 930,
          difficulty: "Hard",
          status: "past",
          topics: ["Graph Theory", "Algorithms"],
          prizes: "Graph theory book collection",
          organizer: "Theoretical CS Society"
        },
        {
          id: 10,
          name: "Code Golf Tournament",
          description: "Solve problems with the shortest possible code. Less code = better score!",
          startTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          duration: "2 hours",
          participants: 1250,
          difficulty: "Varied",
          status: "past",
          topics: ["Code Optimization", "All Languages"],
          prizes: "Bragging rights and special badges",
          organizer: "Code Golf Association"
        }
      ];
    };

    setContests(generateContests());
  }, []);

  const handleRegister = (contestId) => {
    const newRegistered = new Set(registeredContests);
    newRegistered.add(contestId);
    setRegisteredContests(newRegistered);
    
    // Simulate API call
    setTimeout(() => {
      // Show success message or update UI
    }, 500);
  };

  const filteredContests = contests.filter(contest => 
    activeTab === 'all' ? true : contest.status === activeTab
  );

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusBadge = (contest) => {
    const now = new Date();
    const startTime = new Date(contest.startTime);
    const endTime = new Date(startTime.getTime() + parseDuration(contest.duration));
    
    if (now < startTime) {
      return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Upcoming</span>;
    } else if (now >= startTime && now <= endTime) {
      return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Live Now</span>;
    } else {
      return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">Completed</span>;
    }
  };

  const parseDuration = (durationStr) => {
    const hoursMatch = durationStr.match(/(\d+(\.\d+)?)\s*hours?/);
    if (hoursMatch) {
      return parseFloat(hoursMatch[1]) * 60 * 60 * 1000;
    }
    
    const minutesMatch = durationStr.match(/(\d+)\s*minutes?/);
    if (minutesMatch) {
      return parseInt(minutesMatch[1]) * 60 * 1000;
    }
    
    // Default to 2 hours if we can't parse
    return 2 * 60 * 60 * 1000;
  };

  const getDifficultyBadge = (difficulty) => {
    switch(difficulty) {
      case 'Easy':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Easy</span>;
      case 'Medium':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">Medium</span>;
      case 'Hard':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">Hard</span>;
      case 'Expert':
        return <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">Expert</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">{difficulty}</span>;
    }
  };

  const getTopicIcon = (topic) => {
    if (topic.includes("JavaScript") || topic.includes("Web")) return <Code size={14} />;
    if (topic.includes("AI") || topic.includes("Machine")) return <Cpu size={14} />;
    if (topic.includes("Database") || topic.includes("SQL")) return <Database size={14} />;
    if (topic.includes("System") || topic.includes("Network")) return <Network size={14} />;
    return <Zap size={14} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] py-8 px-4">
      <div className="max-w-6xl mx-auto">
         {/* Back Button */}
                  <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                  >
                    <ArrowLeft size={20} />
                    Back
                  </button>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="text-yellow-500 mr-3" size={32} />
            <h1 className="text-3xl font-bold text-white">Coding Contests</h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Test your skills, learn new concepts, and compete with developers from around the world
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#1a1a1a] rounded-lg p-1 flex">
            {['upcoming', 'running', 'past', 'all'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-yellow-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Contest Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContests.map((contest) => (
            <div
              key={contest.id}
              className="bg-[#0a0a0a] border border-[#333333] rounded-xl overflow-hidden hover:border-yellow-500/30 transition-all duration-300"
            >
              {/* Contest Header */}
              <div className="p-4 border-b border-[#333333] bg-gradient-to-r from-[#111111] to-[#0a0a0a]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{contest.name}</h3>
                  {getStatusBadge(contest)}
                </div>
                <p className="text-gray-400 text-sm">{contest.description}</p>
              </div>

              {/* Contest Details */}
              <div className="p-4">
                {/* Date and Time */}
                <div className="flex items-center mb-3 text-sm text-gray-400">
                  <Calendar size={14} className="mr-2" />
                  <span>{formatDate(contest.startTime)}</span>
                </div>
                <div className="flex items-center mb-3 text-sm text-gray-400">
                  <Clock size={14} className="mr-2" />
                  <span>{formatTime(contest.startTime)} • {contest.duration}</span>
                </div>

                {/* Participants and Difficulty */}
                <div className="flex justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <Users size={14} className="mr-2" />
                    <span>{contest.participants.toLocaleString()} participants</span>
                  </div>
                  {getDifficultyBadge(contest.difficulty)}
                </div>

                {/* Topics */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">TOPICS</div>
                  <div className="flex flex-wrap gap-2">
                    {contest.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-[#1a1a1a] text-gray-300 rounded-md text-xs"
                      >
                        {getTopicIcon(topic)}
                        <span className="ml-1">{topic}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prizes */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">PRIZES</div>
                  <div className="flex items-center text-sm text-yellow-500">
                    <Award size={14} className="mr-2" />
                    <span>{contest.prizes}</span>
                  </div>
                </div>

                {/* Organizer */}
                <div className="text-xs text-gray-500">
                  Organized by <span className="text-gray-300">{contest.organizer}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 bg-[#111111] border-t border-[#333333]">
                {getStatusBadge(contest).props.children === "Completed" ? (
                  <button
                    className="w-full bg-gray-700 text-gray-400 py-2 rounded-lg cursor-not-allowed"
                    disabled
                  >
                    Contest Ended
                  </button>
                ) : registeredContests.has(contest.id) ? (
                  <button
                    className="w-full bg-green-500/20 text-green-400 py-2 rounded-lg flex items-center justify-center"
                    disabled
                  >
                    <Check size={16} className="mr-2" />
                    Registered
                  </button>
                ) : (
                  <button
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 rounded-lg transition-colors flex items-center justify-center"
                    onClick={() => handleRegister(contest.id)}
                  >
                    <Star size={16} className="mr-2" />
                    Register Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContests.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-[#1a1a1a] rounded-xl p-8 max-w-md mx-auto">
              <Calendar className="mx-auto text-gray-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">No contests available</h3>
              <p className="text-gray-400">
                There are no {activeTab} contests at the moment. Check back later!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add the missing Check icon component
const Check = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default Contest;