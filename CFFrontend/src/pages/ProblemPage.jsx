import { useState, useEffect, useRef } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Editor from '@monaco-editor/react';
import ChatAi from './ChatAi';
import Editorial from './Editorial';
import { TreeDeciduous, Flower2, Sprout , Tags, FileText, BookOpen, Code2, ListChecks, MessageCircle , ScrollText , RotateCcw , Shuffle, User, Pause, Square, ListVideo , ChevronDown, Flame , CloudUpload , Play, CheckCircle, Circle, Settings, ChevronRight, ChevronLeft, Clock, Cpu, List, Pen, Code, Copy, FlaskConical, PanelLeftClose, Crown, ThumbsUp, ThumbsDown } from 'lucide-react';
import Submission from './Submission';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import logoCF from '../assets/logoCF2.png';


function ProblemPage() {

  const { problemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const [problem, setProblem] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [customTestCase, setCustomTestCase] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [rightPanelHeight, setRightPanelHeight] = useState(60);
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
  const [isResizingVertical, setIsResizingVertical] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [passed, setPassed] = useState('not');
  const [isProblemsMenuOpen, setIsProblemsMenuOpen] = useState(false);
const [problems, setProblems] = useState([]);
const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
const [solvedProblems, setSolvedProblems] = useState([]);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: "ai", 
      content: "Hi! I'm CodeForge AI. How can I help with your code today?", 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    },
  ]);
const tabConfig = {
  description: {
    icon: FileText,
    color: 'text-blue-400', // Blue for description
    activeColor: 'text-blue-300' // Lighter blue when active
  },
  editorial: {
    icon: BookOpen,
    color: 'text-green-400', // Green for editorial
    activeColor: 'text-green-300'
  },
  solutions: {
    icon: Code2,
    color: 'text-purple-400', // Purple for solutions
    activeColor: 'text-purple-300'
  },
  submissions: {
    icon: ListChecks,
    color: 'text-yellow-400', // Yellow for submissions
    activeColor: 'text-yellow-300'
  },
  chatAi: {
    icon: MessageCircle,
    color: 'text-pink-400', // Pink for chat AI
    activeColor: 'text-pink-300'
  }
};

// Add these functions to your component
const startTimer = () => {
  if (!isTimerRunning) {
    const startTime = Date.now() - elapsedTime;
    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 10);
    setIsTimerRunning(true);
  }
};

const pauseTimer = () => {
  if (isTimerRunning) {
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
  }
};

const resetTimer = () => {
  clearInterval(timerRef.current);
  setIsTimerRunning(false);
  setElapsedTime(0);
};

// Format time function
const formatTime = (time) => {
  const minutes = Math.floor((time / 60000) % 60);
  const seconds = Math.floor((time / 1000) % 60);
  const milliseconds = Math.floor((time / 10) % 100);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

// Clean up effect to prevent memory leaks
useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
}, []);

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axiosClient.get(`/problem/problembyid/${problemId}`);
        setProblem(data);
        console.log('Problem data:', data);
        
        // Set initial code based on selected language
        const initialCode = data.startCode.find(sc => 
          sc.language.toLowerCase() === language.toLowerCase()
        )?.initialCode || '';
        setCode(initialCode);
        
        // Set visible test cases
        setTestCases(data.visibleTestCases || []);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };

    fetchProblem();
  }, [problemId, language]);

  // Update code when language changes
  useEffect(() => {
    if (problem && problem.startCode) {
      const initialCode = problem.startCode.find(sc => 
        sc.language.toLowerCase() === language.toLowerCase()
      )?.initialCode || '';
      setCode(initialCode);
    }
  }, [language, problem]);

  // Handle editor mounting
  const handleEditorDidMount = () => {
    setEditorReady(true);
  };

// Handle code execution
const handleRunCode = async () => {
  if (!code) return;
  
  setIsRunning(true);
  setOutput('Running...');
  setSubmissionResult(null);
  
  try {
    const { data } = await axiosClient.post(`/submission/run/${problemId}`, {
      code,
      language
    });
    
    // Set the submission result (matches the format of submitCode response)
    setSubmissionResult(data);
    
    if (data.status === 'accepted') {
      setOutput(`All test cases passed! (${data.testCasesPassed}/${data.testCasesTotal})`);
       setPassed('accepted');
    } else if (data.status === 'wrong') {
      setOutput(`Wrong answer. Passed ${data.testCasesPassed}/${data.testCasesTotal} test cases`);
    } else if (data.status === 'error') {
      setOutput(`Error: ${data.errorMessage || 'Unknown error occurred'}`);
    } else {
      setOutput(`Execution ${data.status}`);
    }
  } catch (error) {
    console.error('Error running code:', error);
    setOutput('Error: ' + (error.response?.data?.message || error.message));
  } finally {
    setIsRunning(false);
  }
};

  // Handle code submission
  const handleSubmitCode = async () => {
    if (!code) return;
    
    setIsSubmitting(true);
    setOutput('Submitting...');
    setSubmissionResult(null);
    
    try {
      const { data } = await axiosClient.post(`/submission/submit/${problemId}`, {
        problemId,
        code,
        language
      });
      // console.log('Submission result:', data);
      
      // Set the submission result
      setSubmissionResult(data);
      
      if (data.status === 'accepted') {
        setOutput('Accepted! All test cases passed.');
        setPassed('accepted');
      } else {
        setOutput(`Submission ${data.status}`);
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      setOutput('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMonacoLanguage = (lang) => {
    const langMap = {
      'javascript': 'javascript',
      'java': 'java',
      'c++': 'cpp',
      'cpp': 'cpp'
    };
    return langMap[lang.toLowerCase()] || 'javascript';
  };

  // Handle horizontal resizing
  const startResizingHorizontal = (e) => {
    setIsResizingHorizontal(true);
    document.addEventListener('mousemove', handleHorizontalResize);
    document.addEventListener('mouseup', stopHorizontalResizing);
  };

  const handleHorizontalResize = (e) => {
    if (isResizingHorizontal) {
      const container = document.getElementById('problem-container');
      const containerRect = container.getBoundingClientRect();
      const relativeX = e.clientX - containerRect.left;
      const percentage = (relativeX / containerRect.width) * 100;
      setLeftPanelWidth(Math.min(Math.max(percentage, 20), 80));
    }
  };

  const stopHorizontalResizing = () => {
    setIsResizingHorizontal(false);
    document.removeEventListener('mousemove', handleHorizontalResize);
    document.removeEventListener('mouseup', stopHorizontalResizing);
  };

  // Handle vertical resizing
  const startResizingVertical = (e) => {
    setIsResizingVertical(true);
    document.addEventListener('mousemove', handleVerticalResize);
    document.addEventListener('mouseup', stopVerticalResizing);
  };

  const handleVerticalResize = (e) => {
    if (isResizingVertical) {
      const container = document.getElementById('right-panel');
      const containerRect = container.getBoundingClientRect();
      const relativeY = e.clientY - containerRect.top;
      const percentage = (relativeY / containerRect.height) * 100;
      setRightPanelHeight(Math.min(Math.max(percentage, 30), 90));
    }
  };

  const stopVerticalResizing = () => {
    setIsResizingVertical(false);
    document.removeEventListener('mousemove', handleVerticalResize);
    document.removeEventListener('mouseup', stopVerticalResizing);
  };
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
  console.log(user)
}, [user]);

  // Replace the problematic code block with this properly defined function
const navigateToProblem = (direction) => {
  if (problems.length === 0) return;
  
  let newIndex;
  if (direction === 'next') {
    newIndex = (currentProblemIndex + 1) % problems.length;
  } else if (direction === 'prev') {
    newIndex = (currentProblemIndex - 1 + problems.length) % problems.length;
  }
  
  setCurrentProblemIndex(newIndex);
  navigate(`/problem/problemById/${problems[newIndex]._id}`);
};

  // Format tags for display
  const formatTags = (tags) => {
    if (Array.isArray(tags)) {
      return tags;
    } else if (typeof tags === 'string') {
      return [tags];
    }
    return [];
  };

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading problem...</div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#000000] flex-col h-screen ">
      {/* Navbar */}
    <nav className="bg-[#000000] h-12 px-8 flex items-center justify-between text-white shadow-lg w-screen">
          
          {/* Left Section */}
          <div className="flex items-center space-x-6 mr-28">
            <NavLink to="/" className="flex items-center">
              <img src={logoCF} alt="CodeForge Logo" className="h-9 mb-1" />
            </NavLink>
    
           <NavLink 
  to="#" 
  onClick={() => setIsProblemsMenuOpen(!isProblemsMenuOpen)} 
  className="hover:text-[#FFD33D] font-medium flex items-center gap-2"
>
  <List size={24} className="text-gray-400 hover:text-[#FFD33D]" />
  Problems
</NavLink>
    
            <button 
  onClick={() => navigateToProblem('prev')}
  className="hover:text-[#FFD33D] font-medium flex items-center gap-2"
  disabled={problems.length === 0}
>
  <ChevronLeft size={26} className="text-gray-400 hover:text-[#FFD33D]" />
</button>

<button 
  onClick={() => navigateToProblem('next')}
  className="hover:text-[#FFD33D] font-medium flex items-center gap-2"
  disabled={problems.length === 0}
>
  <ChevronRight size={26} className="text-gray-400 hover:text-[#FFD33D]" />
</button>
    
            <button title='coming Soon' className="hover:bg-gray-800 p-2 rounded-full">
              <Shuffle size={18} />
            </button>
          </div>
    
          {/* Center Section */}
          <div className="flex items-center space-x-2 justify-center flex-1">
            <button
              onClick={handleRunCode}
              disabled={isRunning || !editorReady}
              className="flex items-center px-3 py-1 border border-white rounded-lg text-blue-400 hover:bg-gray-800 transition"
            >
              <Play size={16} className="mr-2" />
              Run
            </button>
    
            <button
              onClick={handleSubmitCode}
              disabled={isSubmitting || !editorReady}
              className="flex items-center px-3 py-1 border border-white rounded-lg text-green-400 hover:bg-gray-800 transition"
            >
              <CloudUpload size={16} className="mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            </div>
     {/* Right Section */}
          <div className="flex items-center space-x-14">
            <div className="flex items-center space-x-1 justify-center flex-1">
    
          <div title="Streak" className="flex items-center mr-12 gap-1">
  <div className="flex flex-col items-center">
    <p className="text-white font-semibold text-sm">0</p>
  </div>
  <Flame className="text-yellow-300 hover:text-red-400 ml-1" size={22} />
</div>

    
            <div className="flex items-center  rounded-lg px-4 py-2 space-x-3 min-h-[30px]">
              <span className="text-sm font-mono text-white">{formatTime(elapsedTime)}</span>
              {!isTimerRunning ? (
                <button onClick={startTimer} className="text-green-400 hover:text-green-300">
                  <Play size={18} />
                </button>
              ) : (
                <button onClick={pauseTimer} className="text-yellow-400 hover:text-yellow-300">
                  <Pause size={18} />
                </button>
              )}
              <button onClick={resetTimer} className="text-red-400 hover:text-red-300">
                <RotateCcw  size={18} />
              </button>
            </div>
          </div>
    
         
            {/* Adjusted space so Stopwatch is closer to User Profile */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={()=>{navigate('/profile')}}>
                    <img
                      src={user.profileImage}
                      alt="User Profile"
                      className="w-10 h-10 rounded-full border-2 border-gray-600 object-cover"
                    />
                    <span className="font-medium">{user.firstName}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
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
          </div>
        </nav>

        {/* Problems Side Menu */}
<div className={`fixed top-0 left-0 h-full w-80 bg-[#1a1a1a] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isProblemsMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
  <div className="p-4 border-b border-gray-700 flex justify-between items-center">
    <h2 className="text-xl font-medium text-yellow-500">Problems List</h2>
    <button 
      onClick={() => setIsProblemsMenuOpen(false)}
      className="text-gray-400 hover:text-white"
    >
      <PanelLeftClose size={20}/>
      
    </button>
  </div>
  
  <div className="overflow-y-auto h-full pb-20">
    {problems.map((problem, index) => {
      const isSolved = solvedProblems.some((sp) => sp._id === problem._id);
      
      return (
        <NavLink
          key={problem._id}
          to={`/problem/problemById/${problem._id}`}
          className="block p-4 border-b border-gray-700 hover:bg-[#252525] transition-colors"
          onClick={() => setIsProblemsMenuOpen(false)}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">{index + 1}.</span>
            {isSolved && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
        <div className="flex items-center gap-8 mt-2">  
          <h3 className="text-white hover:text-yellow-400 font-medium mt-1">{problem.title}</h3>
            <span className={`text-xs px-2 py-1 rounded ${
              problem.difficulty.toLowerCase() === "easy"
                ? "bg-green-500/20 text-green-400"
                : problem.difficulty.toLowerCase() === "medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400"
            }`}>
              {problem.difficulty}
            </span>
          </div>
        </NavLink>
      );
    })}
  </div>
</div>

{/* Overlay when menu is open */}
{isProblemsMenuOpen && (
  <div 
    className="fixed inset-0 bg-black/50  z-40"
    onClick={() => setIsProblemsMenuOpen(false)}
  />
)}

      {/* Main Content */}
      <div className="flex flex-1 p-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="flex-1 gap-0.5">
          {/* Left Panel - Problem Details */}
          <Panel defaultSize={50} minSize={20} maxSize={80} >
  <div className="no-scrollbar h-full flex flex-col bg-[#202020] text-gray-100 border-1 border-gray-500 rounded-xl">
    {/* Tabs */}
    <div className="flex bg-[#333333]  overflow-x-auto">
      {['description', 'editorial', 'solutions', 'submissions', 'chatAi'].map((tab) => {
        const { icon: IconComponent, color, activeColor } = tabConfig[tab];
        const isActive = activeTab === tab;
        
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 text-sm font-medium flex items-center ${
              isActive
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <IconComponent 
              size={16} 
              className={`mr-2 ${isActive ? activeColor : color}`} 
            />
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        );
      })}
    </div>
    
    {/* Scrollable Content Area */}
    <div className="flex-1 overflow-y-auto p-4 no-scrollbar ">
      {/* Problem Title and Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">{problem.title}</h1>
        <div className="flex items-center">
          {user?.role === 'admin' && (
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate(`/problem/update/${problem._id}`)}
                className="btn btn-sm btn-outline rounded-2xl text-blue-500 border-gray-600"
              >
                <Pen size={14}/>
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {formatTags(problem.tags).map((tag, index) => (
          <span
            key={index}
            className="border text-yellow-400 px-3 py-1 rounded-full text-sm flex gap-1 items-center"
          >
            <Tags size={16}/>
            {tag}
          </span>
        ))}
        
        <span className={`px-3 py-1 text-sm font-semibold rounded-full mr-2 flex gap-1 items-center ${
          problem.difficulty === 'easy' ? 'border text-green-500' :
          problem.difficulty === 'medium' ? 'border text-blue-500' :
          'border text-red-500'
        }`}>
          {
          problem.difficulty === 'easy' ? <Sprout /> :
          problem.difficulty === 'medium' ? <Flower2 /> :
          <TreeDeciduous />
        }
          
          {problem.difficulty}
        </span>
      </div>

      {/* Tab Content */}
      {activeTab === 'description' && (
  <div className="text-gray-200 relative">
    <div className="prose prose-invert max-w-none font-medium">
      <p>{problem.description}</p>
    </div>
    
    {/* Examples */}
    {testCases.length > 0 && (
      <div className="mt-8">
        {testCases.map((testCase, index) => (
          <div key={index} className="mb-6 p-4 rounded-md">
            <p className="font-medium mb-2 -ml-4 text-white">Example {index + 1}:</p>
            <div className="grid gap-2">
              <div>
                <p className="text-lg font-bold flex gap-2 text-gray-300 mb-1">Input: {testCase.input}</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-300 mb-1">Output: {testCase.output}</p>
              </div>
            </div>
            {testCase.explaination && (
              <div className="mt-3">
                <p className="text-lg font-bold text-gray-300 mb-1">Explanation: {testCase.explaination}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Constraints */}
    <div className="mt-8 mb-14">
      <h3 className="text-lg font-medium text-white mb-4">Constraints</h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-200">
        <li>
          <span className="inline-block border rounded-lg bg-[#2c2c2c] p-1 px-3">
            1 ≤ x ≤ 10^4
          </span>
        </li>
        <li>
          <span className="inline-block border rounded-lg bg-[#2c2c2c] p-1 px-3">
            1 ≤ y ≤ 10^4
          </span>
        </li>
        <li>
            It's guaranteed that the answer will fit in a 32-bit integer
        </li>
      </ul>
    </div>
    
    {/* Like/Dislike buttons with fixed positioning */}
    <div className="fixed bottom-3 left-3 flex items-center bg-[#272727] rounded-lg p-1 shadow-lg border border-gray-700">
      <div className="flex items-center mr-4 ">
        <button className="p-1.5 rounded-md hover:bg-gray-700 transition-colors mr-1">
          <ThumbsUp size={16} className="text-gray-400 hover:text-green-400" />
        </button>
        <span className="text-sm text-gray-400">150</span>
      </div>
      <div className="flex items-center border-l border-gray-600">
        <button className="p-1.5 rounded-md hover:bg-gray-700 transition-colors mr-1">
          <ThumbsDown size={16} className="text-gray-400 hover:text-red-400" />
        </button>
        <span className="text-sm text-gray-400">21</span>
      </div>
    </div>
  </div>
)}

     {activeTab === 'editorial' && (
  !user?.isPaid ? (
    <div className="premium-lock-message flex flex-col items-center text-center p-4 bg-gray-800 rounded-lg">
      <Crown size={24} className="mb-2 text-yellow-400" />
      <p className="text-white mb-4">Upgrade to Premium to unlock this feature</p>
      <button
        className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition"
        onClick={() => navigate('/pricing')}
      >
        Explore Premium
      </button>
    </div>
  ) : (
    <div className="text-gray-200">
      <Editorial
        secureUrl={problem.secureUrl}
        thumbnailUrl={problem.thumbnailUrl}
        duration={problem.duration}
      />
    </div>
  )
)}

      
      {activeTab === 'solutions' && (
  !user?.isPaid ? (
    <div className="premium-lock-message flex flex-col items-center text-center p-4 bg-gray-800 rounded-lg">
      <Crown size={24} className="mb-2 text-yellow-400" />
      <p className="text-white mb-4">Upgrade to Premium to unlock this feature</p>
      <button
        className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition"
        onClick={() => navigate('/pricing')}
      >
        Explore Premium
      </button>
    </div>
  ) : (
    <div className="text-gray-200">
      <h3 className="text-lg font-medium text-white mb-4">Reference Solutions</h3>

      {problem.referenceSolution && problem.referenceSolution.length > 0 ? (
        <div className="space-y-6">
          {problem.referenceSolution.map((solution, index) => {
            const copyToClipboard = () => {
              navigator.clipboard.writeText(solution.completeCode)
                .then(() => {
                  const button = document.getElementById(`copy-btn-${index}`);
                  if (button) {
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';
                    button.classList.add('bg-green-600');
                    setTimeout(() => {
                      button.textContent = originalText;
                      button.classList.remove('bg-green-600');
                    }, 2000);
                  }
                })
                .catch(err => {
                  console.error('Failed to copy: ', err);
                });
            };

            return (
              <div key={index} className="bg-gray-700 rounded-lg p-4 relative">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-2">
                  <h4 className="text-md font-medium text-white flex items-center">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm mr-2">
                      {solution.language}
                    </span>
                    Solution
                  </h4>
                  <button
                    id={`copy-btn-${index}`}
                    onClick={copyToClipboard}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Copy Code
                  </button>
                </div>
                <div className="relative">
                  <pre className="notebook-bg text-green-400 p-4 rounded-md overflow-auto text-sm">
                    {solution.completeCode}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400">No reference solutions available.</p>
      )}
    </div>
  )
)}


      {activeTab === 'submissions' && (
        <div className="text-gray-200">
          <h3 className="text-lg font-medium text-white mb-4">Submissions</h3>
          {problem && <Submission pid={problemId}/>}
        </div>
      )}
      
      {activeTab === 'chatAi' && (
  !user?.isPaid ? (
    <div className="premium-lock-message flex flex-col items-center text-center p-4 bg-gray-800 rounded-lg">
      <Crown size={24} className="mb-2 text-yellow-400" />
      <p className="text-white mb-4">Upgrade to Premium to unlock this feature</p>
      <button
        className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition"
        onClick={() => navigate('/pricing')}
      >
        Explore Premium
      </button>
    </div>
  ) : (
    <div className="text-gray-200">
      <p className="text-gray-400">
        {problem && (
          <ChatAi
            problem={problem}
            code={code}
            language={language}
            messages={messages}
            setMessages={setMessages}
          />
        )}
      </p>
    </div>
  )
)}


    </div>
  </div>
</Panel>

          <PanelResizeHandle className="w-1 bg-transparent hover:bg-blue-500 transition-colors" />

          {/* Right Panel - Editor and Output */}
          <Panel>
            <PanelGroup direction="vertical" className="flex-1 gap-0.5">
             {/* Code Editor */}
{/* Code Editor */}
<Panel defaultSize={60} minSize={30} maxSize={90}>
  <div className="h-full flex flex-col pb-1 bg-[#1e1d1d] border-1 border-gray-500 rounded-xl">
    <div className="bg-[#333333] rounded-t-xl px-4 py-2">
      <p className='flex gap-1 items-center'><Code size={18} className='text-green-400'/> Code</p>
    </div>
    <div className="flex bg-[#202020] items-center justify-between px-2 py-1 border-b border-gray-500">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="text-sm w-22 bg-[#202020] hover:bg-[#373636] p-1 rounded-lg hover:cursor-pointer text-white"
      >
        <option value="javascript">JavaScript</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
      </select>
      <div className='flex gap-4'>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(code);
            // Optional: Show a notification that code was copied
          }}
          className='hover:bg-[#373636] hover:cursor-pointer rounded-lg p-1 text-white'
          title="Copy code"
        >
          <Copy size={16}/>
        </button>
        <button 
          onClick={() => {
            const initialCode = problem.startCode.find(sc => 
              sc.language.toLowerCase() === language.toLowerCase()
            )?.initialCode || '';
            setCode(initialCode);
          }}
          className='hover:bg-[#373636] hover:cursor-pointer rounded-lg p-1 text-white'
          title="Reset code"
        >
          <RotateCcw size={16}/>
        </button>
      </div>
    </div>
    <div className="flex-1 bg-[#1e1d1d]  border-gray-500 rounded-b-md overflow-hidden">
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={code}
        onChange={(value) => setCode(value || '')}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  </div>
</Panel>

              <PanelResizeHandle className="h-1 bg-transparent hover:bg-blue-500 transition-colors" />

              {/* Test Cases and Output */}
              <Panel>
                <div className="h-full bg-[#202020] overflow-auto no-scrollbar rounded-xl border-1 px-4 pb-4 border-gray-500">
                  <div className='bg-[#333333] p-2  -mx-4'>
                    <h3 className="text-md font-medium flex gap-1 items-center text-gray-200">
                      <FlaskConical size={20} className='text-green-500'/> Test Cases
                    </h3>
                  </div>
                  
                   {/* Submission Result */}
              {submissionResult && (
                <div className="mb-4 p-4 mt-4 bg-white rounded-md shadow">
                  <h4 className="text-lg font-medium mb-3 flex items-center">
                    <span className={`mr-2 ${submissionResult.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                      {submissionResult.status === 'accepted' ? 'Accepted' : 'Wrong Answer'}
                    </span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-gray-600" />
                      <span className="text-black text-sm">Runtime: {submissionResult.runtime}s</span>
                    </div>
                    <div className="flex items-center">
                      <Cpu size={16} className="mr-2 text-gray-600" />
                      <span className="text-black text-sm">Memory: {submissionResult.memory}KB</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-sm">
                    <span className={`px-2 py-1 rounded ${
                      submissionResult.status === 'accepted' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {submissionResult.testCasesPassed}/{submissionResult.testCasesTotal} test cases passed
                    </span>
                  </div>
                  
                  {submissionResult.errorMessage && (
                    <div className="mt-3 p-3 bg-red-50 rounded-md">
                      <h5 className="text-sm font-medium text-red-800 mb-1">Error:</h5>
                      <pre className="text-sm text-red-600 overflow-auto">{submissionResult.errorMessage}</pre>
                    </div>
                  )}
                </div>
              )}
              
              <div className="my-4">
                <h4 className="text-lg font-bold text-gray-200 mb-2">Output</h4>
                <pre className="bg-gray-800 text-gray-200 p-4 rounded-md text-sm overflow-auto max-h-40">
                  {output || 'Run code to see output'}
                </pre>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testCases.map((testCase, index) => (
                  <div key={index} className="border rounded-md p-3 bg-[#ffffffe0]">
                    <div className="flex items-center mb-2">
                      <span className="text-md font-medium text-gray-800">Case {index + 1}</span>
                      <div className="ml-auto">
                         {passed === 'accepted' ? <CheckCircle size={16} className="text-green-400" /> : <Circle size={16} className="text-gray-400" />}
                      </div>
                    </div>
                    <div className="text-xs text-gray-900">
                      <p>Input: {testCase.input}</p>
                      <p>Expected: {testCase.output}</p>
                    </div>
                  </div>
                ))}
              </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;