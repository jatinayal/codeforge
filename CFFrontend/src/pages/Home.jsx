import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Code, Users, Trophy, Star, ArrowRight, Bell, ChevronRight, ChevronDown, Flame, TrendingUp, Shield, Zap, List, CheckCircle, XCircle, Crown, Diamond, Gem, Dot, BellDot, HelpCircle, BookOpen, MessageCircle, FileText, Send, MapPin, Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import homeHero from '../assets/homeHero.png';
import logoCF from '../assets/logoCF2.png';
import heroVideo from '../assets/herovid.mp4'

const Home = () => {
  const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [theme, setTheme] = useState('dark')
    const [isNotificationOpen, setNotificationOpen] = useState(false);

    useEffect(() => {
  const handleClickOutside = (event) => {
    if (isNotificationOpen && !event.target.closest('.notification-container')) {
      setNotificationOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isNotificationOpen]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden no-scrollbar">
     



  {/* Navbar */}
            <nav className="h-12 no-scrollbar  bg-[#000000] border-b border-[#333333] px-8 py-3 flex items-center justify-between text-white shadow-lg">
              {/* Left: Logo + Nav */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  <img src={homeHero} alt="CodeForge Logo" className="h-9 mb-1" />
                </div>
      
                <div className="hidden md:flex space-x-6">
                  <NavLink to="/problems" className="hover:text-[#FFD33D] font-medium flex items-center gap-2">
                    <List size={20} className="text-gray-400 hover:text-[#FFD33D]" />
                    Problems
                  </NavLink>
                  <NavLink to="/contests" className="hover:text-[#FFD33D] font-medium">
                    Contests
                  </NavLink>
                  <NavLink to="/discuss" className="hover:text-[#FFD33D] font-medium">
                    Discuss
                  </NavLink>
                  <NavLink to="/leaderboard" className="hover:text-[#FFD33D] font-medium">
                    Leaderboard
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
  
  {user ? (
    <>
      {/* User Profile */}
      <div className="relative">
        <button
          onClick={() => navigate('/profile')}
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
        </button>
      </div>
    </>
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

      {/* Hero Section */}
      <section className="pt-8 relative no-scrollbar min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] overflow-hidden">
        <div className="absolute no-scrollbar inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBkPSJNIDAgMCBMIDYwIDYwIE0gNjAgMCBMIDAgNjAiLz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative no-scrollbar z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
  <div className="mb-8 flex justify-center">
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2 flex items-center gap-2">
      <Flame className="h-5 w-5 text-yellow-500" />
      <span className="text-yellow-500 text-sm font-medium">Join 10,000+ developers</span>
      {/* <ChevronRight className="h-4 w-4 text-yellow-500" /> */}
    </div>
  </div>
  
  <div className="flex items-center justify-center mb-6">
    <img 
      src={logoCF} 
      alt="CodeForge Logo" 
      className="h-16 md:h-20 mr-4" 
    />
    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-100">Code</span>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Forge</span>
    </h1>
  </div>
  
  <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
    Master coding skills, conquer challenges, and forge your path to becoming a top-tier developer.
  </p>
  
  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
    <NavLink 
      to="/problems" 
      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
    >
      Start Coding Now
      <ArrowRight className="h-5 w-5" />
    </NavLink>
    <NavLink 
      to="/contests" 
      className="border border-yellow-500/30 hover:border-yellow-500 text-yellow-500 font-semibold px-8 py-4 rounded-lg transition-all duration-300"
    >
      Join Contest
    </NavLink>
  </div>
  
  <div className="grid grid-cols-1 mb-8 md:grid-cols-3 gap-8 mt-20">
    <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transform hover:-translate-y-2 transition-all duration-300">
      <div className="bg-yellow-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
        <Code className="h-6 w-6 text-yellow-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">500+ Challenges</h3>
      <p className="text-gray-400">Curated problems from easy to expert level</p>
    </div>
    
    <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transform hover:-translate-y-2 transition-all duration-300">
      <div className="bg-yellow-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
        <Trophy className="h-6 w-6 text-yellow-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Weekly Contests</h3>
      <p className="text-gray-400">Compete with developers worldwide</p>
    </div>
    
    <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transform hover:-translate-y-2 transition-all duration-300">
      <div className="bg-yellow-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
        <Users className="h-6 w-6 text-yellow-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Community</h3>
      <p className="text-gray-400">Learn from experienced developers</p>
    </div>
  </div>
</div>
      </section>

{/* Stats Section */}
<section className="py-20 bg-black">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col lg:flex-row items-center gap-12">
      {/* Left: Compiler Video */}
      <div className="w-full lg:w-1/2 relative">
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800 transform hover:scale-105 transition-transform duration-300">
          {/* Video element with autoplay, loop, and no controls */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-auto"
            style={{ objectFit: 'cover' }}
          >
            {/* Add multiple sources for better browser compatibility */}
            <source src={heroVideo} type="video/mp4" />
            <source src={heroVideo} type="video/webm" />
            {/* Fallback image if video doesn't load */}
            <img 
              src={homeHero} 
              alt="CodeForge Compiler Interface" 
              className="w-full h-auto"
            />
          </video>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-yellow-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-black/80 text-white px-4 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Try Our Compiler
            </div>
          </div>
        </div>
      </div>
      
      {/* Right: Stats Grid */}
      <div className="w-full lg:w-1/2">
        <div className="grid grid-cols-2 gap-8">
          {/* Row 1 */}
          <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-yellow-500/30 transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">10K+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-yellow-500/30 transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">500+</div>
            <div className="text-gray-400">Coding Problems</div>
          </div>
          
          {/* Row 2 */}
          <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-yellow-500/30 transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">95%</div>
            <div className="text-gray-400">Satisfaction Rate</div>
          </div>
          <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-yellow-500/30 transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">24/7*</div>
            <div className="text-gray-400">Support</div>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-8 text-center lg:text-left">
          <p className="text-gray-500 text-sm">
            * Our support team responds to queries within 24 hours
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CodeForge?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We provide everything you need to improve your coding skills and prepare for technical interviews.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-500/10 p-2 rounded-lg mr-4">
                  <Zap className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold">Real-time Code Editor</h3>
              </div>
              <p className="text-gray-400">Practice with our built-in code editor that supports multiple languages and provides instant feedback.</p>
            </div>
            
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-500/10 p-2 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold">Progress Tracking</h3>
              </div>
              <p className="text-gray-400">Monitor your improvement with detailed analytics and personalized recommendations.</p>
            </div>
            
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-500/10 p-2 rounded-lg mr-4">
                  <Shield className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold">Interview Preparation</h3>
              </div>
              <p className="text-gray-400">Get ready for technical interviews with curated questions from top companies.</p>
            </div>
            
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-500/10 p-2 rounded-lg mr-4">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold">Gamified Learning</h3>
              </div>
              <p className="text-gray-400">Earn points, badges, and climb the leaderboard as you solve challenges.</p>
            </div>
            
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-500/10 p-2 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold">Community Support</h3>
              </div>
              <p className="text-gray-400">Connect with other developers, share solutions, and learn together.</p>
            </div>
            
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-500/10 p-2 rounded-lg mr-4">
                  <Code className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold">Multi-language Support</h3>
              </div>
              <p className="text-gray-400">Code in JavaScript, Java, C++, and more with full language support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20 bg-gradient-to-b from-[#0a0a0a] to-black">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
      <p className="text-gray-400 max-w-2xl mx-auto">Unlock your full potential with our flexible pricing options</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Free Plan */}
      <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 relative hover:border-yellow-500/30 transition-all duration-300 transform hover:-translate-y-2">
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <div className="bg-yellow-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="flex items-end mb-4">
              <span className="text-3xl font-bold">₹0</span>
              <span className="text-gray-400 ml-1">/forever</span>
            </div>
            <p className="text-gray-400">Perfect for beginners starting their coding journey</p>
          </div>
          
          <div className="flex-grow mb-6">
            <ul className="space-y-3">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Access to 100+ problems</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Basic code editor</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Community support</span>
              </li>
              <li className="flex items-center">
               <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Video solutions</span>
              </li> 
              <li className="flex items-center text-gray-500">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span>Premium problems</span>
              </li>
            </ul>
          </div>
          <Link to="/pricing">
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-lg transition-colors">
            Get Started
          </button>
          </Link>
        </div>
      </div>
      
      {/* Pro Plan - Most Popular */}
      <div className="bg-[#111111] border-2 border-yellow-500 rounded-xl p-6 relative hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 transform hover:-translate-y-2">
        <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
          MOST POPULAR
        </div>
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <div className="bg-yellow-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Crown className="h-6 w-6 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="flex items-end mb-4">
              <span className="text-3xl font-bold">₹199</span>
              <span className="text-gray-400 ml-1">/month</span>
            </div>
            <p className="text-gray-400">For serious coders who want to level up their skills</p>
          </div>
          
          <div className="flex-grow mb-6">
            <ul className="space-y-3">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Access to all 500+ problems</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Advanced code editor</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Video solutions</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Exclusive contests</span>
              </li>
            </ul>
          </div>
          
          <Link to="/pricing">
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 rounded-lg transition-colors">
            Upgrade to Pro
          </button>
          </Link>
        </div>
      </div>
      
      {/* Premium Plan - Best Offer */}
      <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 relative hover:border-yellow-500/30 transition-all duration-300 transform hover:-translate-y-2">
        <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
          50% OFF
        </div>
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <div className="bg-purple-500/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Gem className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Premium</h3>
            <div className="flex items-end mb-4">
              <span className="text-3xl font-bold">₹399</span>
              <span className="text-gray-400 ml-1">/month</span>
            </div>
            <p className="text-gray-400">For those who want the complete CodeForge experience</p>
          </div>
          
          <div className="flex-grow mb-6">
            <ul className="space-y-3">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>1-on-1 mentorship</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Certification programs</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Job placement assistance</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Early access to new features</span>
              </li>
            </ul>
          </div>
           <Link to="/pricing">
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors">
            Go Premium
          </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#111111] to-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Forge Your Coding Skills?</h2>
          <p className="text-gray-400 text-xl mb-10">Join thousands of developers who have improved their coding skills with CodeForge.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink 
              to="/signup" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300"
            >
              Create Account
            </NavLink>
            <NavLink 
              to="/problems" 
              className="border border-gray-700 hover:border-yellow-500 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300"
            >
              Explore Challenges
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${theme === 'dark' ? 'bg-black' : 'bg-gray-900'} text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <img src={logoCF} alt="CodeForge Logo" className="h-10 mr-2" />
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
                <li><a href="/problems" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><ChevronRight size={16} className="mr-2" /> Problems</a></li>
                <li><a href="/contests" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><ChevronRight size={16} className="mr-2" /> Contests</a></li>
                <li><a href="/discuss" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><ChevronRight size={16} className="mr-2" /> Discuss</a></li>
                <li><a href="/leaderboard" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><ChevronRight size={16} className="mr-2" /> Leaderboard</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-[#FFD33D] transition-colors flex items-center"><ChevronRight size={16} className="mr-2" /> Plans & Pricing</a></li>
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
                <span>New Delhi, IN</span>
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
};

export default Home;