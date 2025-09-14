import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Repeat, 
  Share, 
  Plus, 
  Lock,
  MoreHorizontal,
  Bookmark
} from 'lucide-react';

const Discuss = () => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sample post data
  const posts = [
    {
      id: 1,
      username: 'codeforge',
      name: 'Code Forge',
      time: '2h ago',
      content: 'Welcome to CodeForge! I hope you\'re enjoying it.',
      hastags: '#CodeForge #welcome #coding #trending',
      likes: 143,
      comments: 36,
      reposts: 12,
      image: 'src/assets/image.png'
    },
    {
  id: 2,
  username: 'discuss',
  name: 'CF Discuss',
  time: '33m ago',
  content: 'This is CodeForge Discuss, CodeForge’s own social media platform where you can share your thoughts with coders around the globe. It is currently under development and will be launched soon. Till then, stay coding and stay tuned!',
  hastags: ' #discuss #codeforgeDiscuss #CodeForge #welcome #coding #trending',
  likes: 42,
  comments: 7,
  reposts: 3,
  image: 'src/assets/Discuss2.png'
}

  ];

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] text-white">
      {/* Header */}
     <div className="sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#333333] z-10">
  <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
    <button 
      onClick={() => navigate(-1)}
      className="p-2 rounded-full hover:bg-[#1a1a1a] transition-colors"
    >
      <ArrowLeft size={20} />
    </button>

    <div className="flex flex-row items-center">
      <img src="/src/assets/Discusslogo.png" alt="Discuss Logo" className="w-10 h-10 mb-1" />
      <h1 className="text-xl font-bold text-white">Discuss</h1>
    </div>

    <div className="w-10"></div> {/* Spacer for balance */}
  </div>
</div>


      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Post Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#0a0a0a] border border-[#333333] rounded-xl overflow-hidden">
              {/* Post Header */}
              <div className="p-4 border-b border-[#333333]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-yellow-400 hover:from-yellow-400 hover:to-violet-600 cursor-pointer flex items-center justify-center">
                      <span className="text-black font-bold text-sm">
                        {post.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{post.name}</h3>
                      <p className="text-gray-400 text-sm">@{post.username} · {post.time}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-[#1a1a1a] text-gray-400">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <p className="text-gray-100 mb-4">{post.content}</p>
                <p className="text-gray-500 mb-4">{post.hastags}</p>
                {post.image && (
                  <div className="rounded-xl overflow-hidden mb-4 border border-[#333333]">
                    <img 
                      src={post.image} 
                      alt="Post content" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Post Stats */}
              <div className="px-4 py-2 border-t border-[#333333] text-sm text-gray-400">
                <span>{post.likes} likes</span>
                <span className="mx-2">·</span>
                <span>{post.comments} comments</span>
                <span className="mx-2">·</span>
                <span>{post.reposts} reposts</span>
              </div>

              {/* Post Actions */}
              <div className="p-2 border-t border-[#333333]">
                <div className="flex justify-around">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                      liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                    <span className="text-sm">Like</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 p-2 rounded-lg text-gray-400 hover:text-blue-500 transition-colors">
                    <MessageCircle size={18} />
                    <span className="text-sm">Comment</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 p-2 rounded-lg text-gray-400 hover:text-green-500 transition-colors">
                    <Repeat size={18} />
                    <span className="text-sm">Repost</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 p-2 rounded-lg text-gray-400 hover:text-yellow-500 transition-colors">
                    <Share size={18} />
                    <span className="text-sm">Share</span>
                  </button>
                  
                  <button 
                    onClick={handleSave}
                    className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
                      saved ? 'text-yellow-500' : 'text-gray-400 hover:text-violet-500'
                    }`}
                  >
                    <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
                    <span className="text-sm">Save</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* No More Posts */}
          <div className="text-center py-8">
            <div className="bg-[#0a0a0a] rounded-xl p-6">
              <p className="text-gray-500">No more posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Button */}
      <div className="fixed bottom-6 right-6">
        <div className="relative group">
          <button 
            className="w-14 h-14 cursor-not-allowed bg-violet-500 hover:bg-violet-600 text-black rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110"
            disabled
          >
            <Plus size={24} />
          </button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-2 flex items-center space-x-2 whitespace-nowrap">
              <Lock size={14} className="text-gray-400" />
              <span className="text-sm text-gray-300">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discuss;