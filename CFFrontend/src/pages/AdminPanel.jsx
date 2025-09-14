import { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { Plus, Edit, Trash2, Settings, Home, Code, ChevronRight, BarChart3, Video } from 'lucide-react';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'create', label: 'Create Problem', icon: Plus, path: '/problem/create', description: 'Add a new coding problem to the platform' },
    { id: 'update', label: 'Update Problem', icon: Edit, path: '/problem/update', description: 'Edit existing problems and their details' },
    { id: 'delete', label: 'Delete Problem', icon: Trash2, path: '/problem/delete', description: 'Remove problems from the platform' },
     { id: 'video', label: 'Video Problem', icon: Video, path: '/problem/video', description: 'Upload and Delete problem Video solutions' },
  ];

  const stats = [
    { label: 'Total Problems', value: '10', icon: Code },
    { label: 'Active Users', value: '3,842', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-gray-950 flex">
      {/* Sidebar Navigation */}
      <div className={`bg-white shadow-xl transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className={`flex items-center ${!isSidebarOpen && 'justify-center w-full'}`}>
            <Settings className="text-blue-600" size={24} />
            {isSidebarOpen && <h1 className="text-xl font-bold text-gray-800 ml-3">Admin Panel</h1>}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1 rounded-full bg-gray-500 hover:bg-gray-600 ${!isSidebarOpen && 'absolute top-6 right-3'}`}
          >
            <ChevronRight className={`transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} size={16} />
          </button>
        </div>
        
        {/* Sidebar Menu */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                    }`}
                  >
                    <IconComponent size={18} className="flex-shrink-0" />
                    {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                    {!isSidebarOpen && (
                      <div className="absolute left-16 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {item.label}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Stats Section */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Platform Overview</h3>
            <div className="space-y-3">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-md">
                      <IconComponent className="text-blue-600" size={16} />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Back to Homepage Button */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/"
            className="flex items-center justify-center px-4 py-3 w-full rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Home size={18} className={isSidebarOpen ? "mr-2" : ""} />
            {isSidebarOpen && "Back to Homepage"}
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-100">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage coding problems on your platform</p>
          </div>

          {/* Dashboard Cards */}
          <Routes>
            <Route
              path="/"
              element={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={item.id} className="bg-gray-300 rounded-xl shadow-md p-6 border-2 border-white hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <IconComponent className="text-blue-600" size={20} />
                          </div>
                          <h2 className="text-xl font-semibold text-gray-800 ml-4">{item.label}</h2>
                        </div>
                        <p className="text-gray-600 mb-6">{item.description}</p>
                        <Link
                          to={item.path}
                          onClick={() => setActiveTab(item.id)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          {item.label}
                          <ChevronRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              }
            />
            <Route path="/problem/create" element={
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Problem</h2>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/problem/update" element={
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Problem</h2>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/problem/delete" element={
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Delete Problem</h2>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;