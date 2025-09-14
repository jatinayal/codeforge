import { useForm } from "react-hook-form";
import { Send, Bot, User, Copy, ChevronDown, Sparkles, MessageCircle } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

const ChatAi = ({ problem, code, language, messages, setMessages }) => {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingMessage, setCurrentTypingMessage] = useState("");
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Scroll to bottom when messages change or typing updates
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTypingMessage]);

  useEffect(() => {
    // Clean up interval on component unmount
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startTypewriterEffect = (text) => {
    let i = 0;
    setIsTyping(true);
    setCurrentTypingMessage("");
    
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    
    typingIntervalRef.current = setInterval(() => {
      if (i < text.length) {
        setCurrentTypingMessage(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
        
        // Add the complete message to the messages array
        const aiResponse = {
          id: messages.length + 1,
          role: "ai",
          content: text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setCurrentTypingMessage("");
      }
    }, 20); // Adjust speed as needed (milliseconds per character)
  };

  const onSubmit = async (data) => {
    if (!data.message.trim()) return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      role: "user",
      content: data.message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newUserMessage]);
    reset();
    setIsLoading(true);
    
    try {
      // Send message to backend API
      const response = await axiosClient.post('/chat', {
        question: data.message.trim(),
        problem: problem || { description: "No problem context" },
        userCode: code || "No code provided",
        language: language || "Not specified"
      });
      
      // Start typewriter effect with the AI response
      startTypewriterEffect(response.data.response);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        role: "ai",
        content: "Sorry, I'm having trouble connecting to the AI service. Please try again later.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Optional: Add a toast notification here
        console.log("Copied to clipboard");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border border-[#333333] rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] border-b border-[#333333]">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center mr-2">
              <MessageCircle size={16} className="text-black" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0a]"></div>
          </div>
          <div>
            <span className="font-semibold text-white">CodeForge AI</span>
            <p className="text-xs text-gray-400">Powered by AI</p>
          </div>
        </div>
        <button 
          onClick={scrollToBottom}
          className="p-1.5 rounded-lg bg-[#1a1a1a] border border-[#333333] text-gray-400 hover:text-yellow-500 transition-colors"
          title="Scroll to bottom"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 no-scrollbar overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]" style={{ maxHeight: '300px' }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-[#333333]">
              <Sparkles size={28} className="text-yellow-500" />
            </div>
            <h3 className="text-white font-medium mb-1">CodeForge AI Assistant</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Ask me anything about your code, debugging tips, or best practices.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "ai" ? "justify-start" : "justify-end"}`}
            >
              <div className={`flex max-w-xs ${message.role === "ai" ? "flex-row" : "flex-row-reverse"}`}>
                {/* Profile Icon */}
                <div className={`flex-shrink-0 ${message.role === "ai" ? "mr-3" : "ml-3"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "ai" 
                      ? "bg-gradient-to-br from-yellow-600 to-yellow-400" 
                      : "bg-gradient-to-br from-blue-600 to-blue-400"
                  }`}>
                    {message.role === "ai" ? (
                      <Bot size={16} className="text-black" />
                    ) : (
                      <User size={16} className="text-white" />
                    )}
                  </div>
                </div>
                
                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-3 ${
                    message.role === "ai"
                      ? "bg-[#1a1a1a] border border-[#333333] rounded-tl-none"
                      : "bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-tr-none"
                  }`}
                >
                  <div className="flex flex-col">
                    <p className={`text-sm ${message.role === "ai" ? "text-gray-200" : "text-black"} break-words`}>
                      {message.content}
                    </p>
                    <div className={`flex items-center mt-2 ${message.role === "ai" ? "justify-between" : "justify-end"}`}>
                      {message.role === "ai" && (
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="text-gray-500 hover:text-yellow-500 transition-colors"
                          title="Copy message"
                        >
                          <Copy size={12} />
                        </button>
                      )}
                      <span className={`text-xs ${message.role === "ai" ? "text-gray-500" : "text-yellow-900"}`}>
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Typing indicator with typewriter effect */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-600 to-yellow-400">
                  <Bot size={16} className="text-black" />
                </div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#333333] rounded-2xl rounded-tl-none p-3">
                <div className="flex flex-col">
                  <p className="text-sm text-gray-200 break-words">
                    {currentTypingMessage}
                    <span className="inline-block w-2 h-3 bg-yellow-500 ml-1 animate-pulse"></span>
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">Typing...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-600 to-yellow-400">
                  <Bot size={16} className="text-black" />
                </div>
              </div>
              <div className="bg-[#1a1a1a] border border-[#333333] rounded-2xl rounded-tl-none p-3">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-3 bg-[#0f0f0f] border-t border-[#333333]"
      >
        <div className="flex items-center gap-2">
          <input
            {...register("message")}
            type="text"
            placeholder="Ask about your code..."
            className="flex-1 bg-[#1a1a1a] border border-[#333333] text-white placeholder-gray-500 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/30 transition-all"
            disabled={isLoading || isTyping}
          />
          <button
            type="submit"
            className="p-2.5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black rounded-xl hover:from-yellow-500 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            disabled={isLoading || isTyping}
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatAi;