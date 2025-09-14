import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import { ChevronDown, List, Search, Filter, CheckCircle, Circle, Tags, Sun, Moon, Trophy, ExternalLink, Calendar, Clock, CircleFadingPlus, ChevronRight, HelpCircle, BookOpen, MessageCircle, Shield, FileText, Send, MapPin, Heart, BellDot, Dot} from "lucide-react";
import { FaTwitter, FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

function Homepage() {
     
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [filters, setFilters] = useState({
      difficulty: "all",
      tag: "all",
      status: "all",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [theme, setTheme] = useState("dark");
        const [isNotificationOpen, setNotificationOpen] = useState(false);
    
        useEffect(() => {
      const handleClickOutside = (event) => {
        if (isNotificationOpen && !event.target.closest('.notification-container')) {
          setNotificationOpen(false);
        }
      };
    
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isNotificationOpen])
  
    // Toggle theme function
    const toggleTheme = () => {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    };
  
    // Apply theme on component mount and when theme changes
    useEffect(() => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
      }
  
      // Apply theme class to body
      if (theme === "dark") {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
      } else {
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme");
      }
    }, [theme]);
  
    useEffect(() => {
      const fetchProblems = async () => {
        try {
          const { data } = await axiosClient.get("/problem/getAllProblem");
          setProblems(data);
        } catch (error) {
          console.error("Error fetching problems: ", error);
        }
      };
  
      const fetchSolvedProblems = async () => {
        try {
          const { data } = await axiosClient.get("/problem/problemSolvedByUser");
          setSolvedProblems(data);
        } catch (error) {
          console.log("Error fetching solved problems: ", error);
        }
      };
  
      fetchProblems();
      if (user) fetchSolvedProblems();
    }, [user]);
  
    const handleLogout = () => {
      dispatch(logoutUser());
      setSolvedProblems([]);
      setOpenMenu(false);
    };
  
    const upcomingContests = [
    {
      platform: 'LeetCode',
      logo: '/logos/leetcode.png',
      contestName: 'Weekly LeetCode Contest',
      startTime: 'Sep 12, 2025 18:00 UTC',
      url: 'https://leetcode.com/contest/',
    },
    {
      platform: 'Codeforces',
      logo: '/logos/codeforces.png',
      contestName: 'Codeforces Round #851',
      startTime: 'Sep 15, 2025 15:00 UTC',
      url: 'https://codeforces.com/contests',
    },
    {
      platform: 'HackerRank',
      logo: '/logos/hackerrank.png',
      contestName: 'HackerRank Weekly Challenge',
      startTime: 'Sep 14, 2025 12:00 UTC',
      url: 'https://www.hackerrank.com/contests',
    },
  ];
  
  
    const filteredProblems = problems.filter((problem) => {
      // Search term filter
      const searchMatch = 
        searchTerm === "" || 
        problem.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Difficulty filter
      const difficultyMatch =
        filters.difficulty === "all" ||
        problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase();
      
      // Tag filter
      const tagMatch =
        filters.tag === "all" ||
        (Array.isArray(problem.tags) && problem.tags.includes(filters.tag)) ||
        (typeof problem.tags === 'string' && problem.tags === filters.tag);
      
      // Status filter
      const statusMatch =
        filters.status === "all" ||
        (filters.status === "solved" &&
          solvedProblems.some((sp) => sp._id === problem._id)) ||
        (filters.status === "unsolved" &&
          !solvedProblems.some((sp) => sp._id === problem._id));
  
      return searchMatch && difficultyMatch && tagMatch && statusMatch;
    });
  
    const clearFilters = () => {
      setFilters({
        difficulty: "all",
        tag: "all",
        status: "all",
      });
      setSearchTerm("");
    };
  
    // Theme classes
    const bgColor = theme === "dark" ? "bg-[#0f0f0f]" : "bg-gray-50";
    const textColor = theme === "dark" ? "text-white" : "text-gray-900";
    const cardBg = theme === "dark" ? "bg-[#1a1a1a]" : "bg-white";
    const cardBorder = theme === "dark" ? "border-gray-800" : "border-gray-200";
    const headerBg = theme === "dark" ? "bg-[#252525]" : "bg-gray-100";
    const headerText = theme === "dark" ? "text-gray-400" : "text-gray-500";
    const inputBg = theme === "dark" ? "bg-[#1a1a1a]" : "bg-white";
    const inputBorder = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const hoverBg = theme === "dark" ? "hover:bg-[#252525]" : "hover:bg-gray-100";
  
  
  const [contests, setContests] = useState([]);
  const [loadingContests, setLoadingContests] = useState(true);

  // Add this useEffect for fetching contests
  useEffect(() => {
    const fetchContests = async () => {
      try {
        // Note: This API might require authentication or API key
        // You might need to adjust this based on the actual API requirements
         const response = await fetch('https://clist.by/api/v2/contest/?limit=5&order_by=-start&upcoming=true', {
  headers: {
    'Authorization': 'ApiKey gabbu:a6c84fbed6d0cd205ef1554b8e7544d8a959ca3b',
  }
})
        
        if (response.ok) {
          const data = await response.json();
          setContests(data.objects || []);
        } else {
          console.error('Failed to fetch contests');
          // Use placeholder data if API fails
          setContests(upcomingContests);
        }
      } catch (error) {
        console.error('Error fetching contests:', error);
        // Use placeholder data if API fails
        setContests(upcomingContests);
      } finally {
        setLoadingContests(false);
      }
    };

    fetchContests();
  }, []);
  
const formatDuration = (seconds) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const now = new Date().getTime();
const start = new Date(contests.startTime).getTime();
const secondsLeft = Math.max(0, Math.floor((start - now) / 1000));

  return (
    <div className={`min-h-screen  ${bgColor} ${textColor}`}>
        {/* Navbar */}
      <nav className="h-12 fixed z-10 w-full bg-[#000000] border-b border-[#333333] px-8 py-3 flex items-center justify-between text-white shadow-lg">
        {/* Left: Logo + Nav */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <img src="/src/assets/logoCF2.png" alt="CodeForge Logo" className="h-9 mb-1" />
          </div>

          <div className="hidden md:flex space-x-6">
            <NavLink className="text-[#FFD33D] font-medium flex items-center gap-2">
              <List size={20} className="text-[#FFD33D]" />
              Problems
            </NavLink>
            <NavLink to="/contests" className="hover:text-[#FFD33D] font-medium">
              Contests
            </NavLink>
            <NavLink to="/discuss" className="hover:text-[#FFD33D] font-medium">
              Discuss
            </NavLink>
            <NavLink to="/leaderboard" className="hover:text-[#FFD33D] font-medium">
              LeaderBoard
            </NavLink>
          </div>
        </div>

        {/* Right: User info + Theme Toggle */}
        <div className="flex items-center space-x-4">
           {/* Notification Button (always visible) */}
  <div className="relative notification-container">
    <button
      onClick={() => setNotificationOpen(!isNotificationOpen)}
      className="p-1 rounded-full hover:bg-gray-800 focus:outline-none"
    >
      <BellDot size={25} className="text-gray-300 hover:text-[#FFD33D]" />
    </button>

    {/* Notification Dropdown */}
    {isNotificationOpen && (
      <div className="fixed right-2 top-14 mt-2 w-80 bg-[#000000] border border-[#333333] rounded-md shadow-lg overflow-hidden z-50">
        <div className="p-4 border-b border-[#333333]">
          <h3 className="text-yellow-400 font-semibold">Notifications</h3>
        </div>
        <div className="py-4 flex gap-1  border-gray-500">
          <Dot size={45} className='text-red-500'/>
          <p className="text-white text-sm">Welcome to CodeForge! I Hope you're enjoying it.</p>
        </div>
        <div className="items-center justify-center p-4 pt-12 flex gap-1">
        <p className="text-gray-500 text-sm">No more Notification</p>
        </div>
        </div>
    )}
  </div>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-gray-400" />
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={user.profileImage}
                  alt="User Profile"
                  className="w-9 h-9 rounded-full border-2 border-gray-600 object-cover"
                />
                <span className="hidden md:inline-block text-white">
                  {user.firstName}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#202020] rounded-md shadow-lg py-2 z-10 border border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">
                      {user.firstName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {user.emailId}
                    </p>
                  </div>
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#333333] hover:text-white"
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#333333] hover:text-white"
                  >
                    Settings
                  </NavLink>
                  {user?.role === 'admin' && (
                    <NavLink
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#333333] hover:text-white"
                    >
                      Admin Access
                    </NavLink>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#333333] hover:text-red-300"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <NavLink to="/login" className="hover:text-[#FFD33D] font-medium">
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-[#FFD33D] text-black px-3 py-1 rounded font-medium hover:bg-yellow-400"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 mt-8">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    {/* Upcoming Contests Section */}
    <div className="w-full md:w-2/3">
      <div className="text-2xl flex items-center gap-4 font-bold mb-8"></div>
       <p className="text-2xl flex items-center gap-4 font-bold mb-3"><CircleFadingPlus size={40} className="text-blue-400"/>Upcoming Contests</p>
      
      
      
      {loadingContests ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <div className="no-scrollbar overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            {contests.map((contest, index) => {
  const now = new Date().getTime();
  const startTime = new Date(contest.start || contest.startTime).getTime();
  const secondsLeft = Math.max(0, Math.floor((startTime - now) / 1000));
  
  return (
    <div
      key={contest.id || index}
      className={`min-w-[280px] rounded-lg p-4 ${cardBg} ${cardBorder} shadow hover:shadow-md transition-shadow`}
    >
       <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    </div>
                    <span className="ml-2 text-sm font-medium truncate max-w-[100px]">
                      {contest.host || contest.resource}
                    </span>
                  </div>
                  <a 
                    href={contest.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-yellow-500 hover:text-yellow-400 flex-shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                
                <h3 className="font-semibold mb-2 line-clamp-2 h-12 overflow-hidden">
                  {contest.event}
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {new Date(contest.start).toLocaleDateString()}
                    </span>
                  </div>
      
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
        <span>Starts in: {formatDuration(secondsLeft)}</span>
      </div>
      
                  {contest.n_problems && (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span>{contest.n_problems} problems</span>
                    </div>
                  )}
                </div>
    </div>
  );
})}
          </div>
        </div>
      )}
    </div>

 {/* Calendar Section */}
             <div className={`rounded-lg p-4 mr-10 ${cardBg} ${cardBorder} shadow`}>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
     <DateCalendar
       defaultValue={dayjs()}
       readOnly
       sx={{
         width: '100%',
         maxWidth: '300px',
         backgroundColor: theme === 'dark' ? '#1a1a1a' : 'white',
         color: theme === 'dark' ? 'white' : 'black',
         borderRadius: '8px',
 
         // Calendar header (month/year label and arrows)
         '& .MuiPickersCalendarHeader-root': {
           color: theme === 'dark' ? 'white' : 'black',
         },
 
         // Navigation arrows (prev/next)
         '& .MuiPickersCalendarHeader-switchViewButton, .MuiPickersCalendarHeader-arrowButton': {
           color: theme === 'dark' ? 'white' : 'black',
         },
 
         // The month-year select dropdown arrow
         '& .MuiPickersCalendarHeader-labelContainer button': {
           color: theme === 'dark' ? 'white' : 'black',
         },
 
         // Weekday labels
         '& .MuiDayCalendar-weekDayLabel': {
           color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
           fontWeight: 'bold',
         },
 
         // Date cells
         '& .MuiPickersDay-root': {
           color: theme === 'dark' ? 'white' : 'black',
           border: 'none',
           borderRadius: '4px',
           '&:hover': {
             backgroundColor: theme === 'dark' ? '#333' : '#f3f4f6',
           },
           '&.Mui-selected': {
             backgroundColor: '#FFD33D',
             color: 'black',
             '&:hover': {
               backgroundColor: '#fcc419',
             },
           },
         },
 
         // Today indicator
         '& .MuiPickersDay-today': {
           border: '1px solid #FFD33D',
         },
       }}
     />
   </LocalizationProvider>
 </div>
  </div>
</div>

         {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
              </div>
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg ${inputBg} ${textColor} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${inputBorder}`}
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${inputBg} hover:text-white  hover:bg-[#252525] ${inputBorder}`}
              >
                <Filter className="h-5 w-5" />
                Filters
                {Object.values(filters).some(value => value !== "all") && (
                  <span className="bg-yellow-500 text-black rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {Object.values(filters).filter(value => value !== "all").length}
                  </span>
                )}
              </button>

              {/* Filter Dropdown */}
              {showFilters && (
                <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-10 p-4 ${cardBg} ${cardBorder}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Filters</h3>
                    <button 
                      onClick={clearFilters}
                      className="text-sm text-yellow-500 hover:text-yellow-400"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Difficulty
                      </label>
                      <select
                        className={`w-full p-2 border rounded ${inputBg} ${textColor} ${inputBorder}`}
                        value={filters.difficulty}
                        onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                      >
                        <option value="all">All Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Tags
                      </label>
                      <select
                        className={`w-full p-2 border rounded ${inputBg} ${textColor} ${inputBorder}`}
                        value={filters.tag}
                        onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                      >
                        <option value="all">All Tags</option>
                        <option value="array">Array</option>
                        <option value="dp">Dynamic Programming</option>
                        <option value="math">Math</option>
                        <option value="graph">Graph</option>
                        <option value="string">String</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Status
                      </label>
                      <select
                        className={`w-full p-2 border rounded ${inputBg} ${textColor} ${inputBorder}`}
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      >
                        <option value="all">All Status</option>
                        <option value="solved">Solved</option>
                        <option value="unsolved">Unsolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className={`rounded-lg shadow overflow-hidden border ${cardBg} ${cardBorder}`}>
          <table className="min-w-full divide-y divide-gray-800">
            <thead className={headerBg}>
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${headerText}`}>
                  No.
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${headerText}`}>
                  Problem
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${headerText}`}>
                  Difficulty
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${headerText}`}>
                  Tags
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${headerText}`}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === "dark" ? "divide-gray-800" : "divide-gray-200"}`}>
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem, index) => {
                  const isSolved = solvedProblems.some((sp) => sp._id === problem._id);

                  // Normalize tags
                  let tags = [];
                  if (Array.isArray(problem.tags)) {
                    if (typeof problem.tags[0] === "string") tags = problem.tags;
                    else if (problem.tags[0]?.name) tags = problem.tags.map((t) => t.name);
                  } else if (typeof problem.tags === "string") {
                    tags = problem.tags.split(",").map((t) => t.trim());
                  }

                  return (
                    <tr key={problem._id} className={theme === "dark" ? "hover:bg-[#1f1e1e] bg-[#111111]" : "hover:bg-gray-50 bg-white"}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <NavLink
                          to={`/problem/problemById/${problem._id}`}
                          className={`font-medium ${theme === "dark" ? "text-white hover:text-yellow-500" : "text-gray-900 hover:text-blue-600"}`}
                        >
                          {problem.title}
                        </NavLink>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded 
                          ${
                            problem.difficulty.toLowerCase() === "easy"
                              ? "border text-green-400"
                              : problem.difficulty.toLowerCase() === "medium"
                              ? "border text-yellow-400"
                              : "border text-red-400"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {tags.length > 0 ? (
                            tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className={`border text-xs px-2 py-1 rounded flex gap-1 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
                              >
                                <Tags size={14}/>
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className={`text-xs ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>No tags</span>
                          )}
                          {tags.length > 3 && (
                            <span className={`text-xs px-2 py-1 rounded ${theme === "dark" ? "bg-[#333333] text-gray-400" : "bg-gray-100 text-gray-600"}`}>
                              +{tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isSolved ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className={`h-5 w-5 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className={`px-6 py-8 text-center ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                    No problems found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <button className={`px-4 py-2 border rounded-lg text-sm ${inputBg} ${hoverBg} ${inputBorder}`}>
              Previous
            </button>
            <button className={`px-4 py-2 border border-yellow-500 rounded-lg text-sm ${inputBg} text-yellow-500`}>
              1
            </button>
            <button className={`px-4 py-2 border rounded-lg text-sm ${inputBg} ${hoverBg} ${inputBorder}`}>
              2
            </button>
            <button className={`px-4 py-2 border rounded-lg text-sm ${inputBg} ${hoverBg} ${inputBorder}`}>
              3
            </button>
            <button className={`px-4 py-2 border rounded-lg text-sm ${inputBg} ${hoverBg} ${inputBorder}`}>
              Next
            </button>
          </div>
        </div>
      </div>
      <footer className={`${theme === 'dark' ? 'bg-black' : 'bg-gray-900'} text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8`}>
  <div className="max-w-7xl mx-auto">
    {/* Main footer content */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {/* Brand section */}
      <div className="lg:col-span-1">
        <div className="flex items-center mb-4">
          <img src="/src/assets/logoCF2.png" alt="CodeForge Logo" className="h-10 mr-2" />
          <span className="text-2xl font-bold text-[#FFD33D]">CodeForge</span>
        </div>
        <p className="text-gray-400 mb-6 max-w-md">
          Master coding skills, compete in challenges, and join a community of passionate developers.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-[#FFD33D] hover:text-black transition-colors">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-[#FFD33D] hover:text-black transition-colors">
            <FaGithub size={20} />
          </a>
          <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-[#FFD33D] hover:text-black transition-colors">
            <FaLinkedin size={20} />
          </a>
          <a href="#" className="p-2 rounded-full bg-gray-800 hover:bg-[#FFD33D] hover:text-black transition-colors">
            <FaYoutube size={20} />
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold mb-6 text-[#FFD33D]">Quick Links</h3>
        <ul className="space-y-3">
          <li><a href="#" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><ChevronRight size={16} className="mr-2" /> Problems</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><ChevronRight size={16} className="mr-2" /> Contests</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><ChevronRight size={16} className="mr-2" /> Discuss</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><ChevronRight size={16} className="mr-2" /> Leaderboard</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><ChevronRight size={16} className="mr-2" /> Blog</a></li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h3 className="text-lg font-semibold mb-6 text-[#FFD33D]">Support</h3>
        <ul className="space-y-3">
          <li><a href="#" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><HelpCircle size={16} className="mr-2" /> Help Center</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><BookOpen size={16} className="mr-2" /> Documentation</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><MessageCircle size={16} className="mr-2" /> Contact Us</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><Shield size={16} className="mr-2" /> Privacy Policy</a></li>
          <li><a href="#" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><FileText size={16} className="mr-2" /> Terms of Service</a></li>
        </ul>
      </div>

      {/* Newsletter */}
      <div>
        <h3 className="text-lg font-semibold mb-6 text-[#FFD33D]">Stay Updated</h3>
        <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
        <div className="flex">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#FFD33D] w-full"
          />
          <button className="bg-[#FFD33D] text-black px-4 py-2 rounded-r-lg hover:bg-yellow-400 transition-colors">
            <Send size={18} />
          </button>
        </div>
        <div className="mt-6 flex items-center text-gray-400">
          <MapPin size={16} className="mr-2" />
          <span>San Francisco, CA</span>
        </div>
      </div>
    </div>

    {/* Bottom section */}
    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
      <p className="text-gray-500 text-sm mb-4 md:mb-0">
        © {new Date().getFullYear()} CodeForge. All rights reserved.
      </p>
      <div className="flex items-center space-x-6">
        <span className="text-gray-500 text-sm flex items-center">
          <Heart size={16} className="mr-1 text-red-500" />
          Made with love for developers
        </span>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-500 hover:text-[#FFD33D] transition-colors text-sm">Privacy</a>
          <a href="#" className="text-gray-500 hover:text-[#FFD33D] transition-colors text-sm">Terms</a>
          <a href="#" className="text-gray-500 hover:text-[#FFD33D] transition-colors text-sm">Sitemap</a>
        </div>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}

export default Homepage;