'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Lock, Notebook, Settings, Key, Share2, 
  Star, History, Trash2, LogOut, Mail, Phone, 
  Globe, Calendar, Edit, Check, X, Moon, Sun
} from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Product designer & developer. Creating digital experiences that matter.',
    location: 'San Francisco, CA',
    joinDate: 'Joined March 2022',
    avatar: '/default-avatar.jpg'
  });
  const [tempData, setTempData] = useState({...userData});

  const tabs = [
    { id: 'overview', icon: <User size={18} />, label: 'Overview' },
    { id: 'notes', icon: <Notebook size={18} />, label: 'My Notes' },
    { id: 'security', icon: <Lock size={18} />, label: 'Security' },
    { id: 'favorites', icon: <Star size={18} />, label: 'Favorites' },
    { id: 'history', icon: <History size={18} />, label: 'History' },
    { id: 'shared', icon: <Share2 size={18} />, label: 'Shared' },
    { id: 'trash', icon: <Trash2 size={18} />, label: 'Trash' },
    { id: 'settings', icon: <Settings size={18} />, label: 'Settings' }
  ];

  const handleEdit = () => {
    setTempData({...userData});
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData({...tempData});
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            My Profile
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} text-gray-400 hover:text-gray-200 transition`}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm p-6 sticky top-8`}>
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative mx-auto mb-4"
                >
                  <img 
                    src={userData.avatar} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-gray-800 shadow-lg"
                  />
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-0 right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-1.5 rounded-full shadow-md"
                  >
                    <Edit size={14} />
                  </motion.button>
                </motion.div>
                <h2 className="text-xl font-semibold">{userData.name}</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{userData.email}</p>
              </div>

              {/* Tabs */}
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ x: 5 }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-400 border border-purple-500/20' 
                      : darkMode 
                        ? 'text-gray-400 hover:bg-gray-700/50' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm overflow-hidden`}
                >
                  <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    {!isEditing ? (
                      <motion.button 
                        onClick={handleEdit}
                        whileHover={{ scale: 1.05 }}
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm font-medium"
                      >
                        <Edit size={16} /> Edit Profile
                      </motion.button>
                    ) : (
                      <div className="flex gap-2">
                        <motion.button 
                          onClick={handleSave}
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm font-medium shadow-md"
                        >
                          <Check size={16} /> Save
                        </motion.button>
                        <motion.button 
                          onClick={handleCancel}
                          whileHover={{ scale: 1.05 }}
                          className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-gray-200 px-3 py-1 rounded-md flex items-center gap-1 text-sm font-medium`}
                        >
                          <X size={16} /> Cancel
                        </motion.button>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Full Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={tempData.name}
                              onChange={(e) => setTempData({...tempData, name: e.target.value})}
                              className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${darkMode 
                                ? 'bg-gray-700 border-gray-600 focus:ring-purple-500 text-white' 
                                : 'bg-white border-gray-300 focus:ring-blue-500 text-gray-900'
                              }`}
                            />
                          ) : (
                            <p className={darkMode ? 'text-gray-100' : 'text-gray-900'}>{userData.name}</p>
                          )}
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</label>
                          {isEditing ? (
                            <input
                              type="email"
                              value={tempData.email}
                              onChange={(e) => setTempData({...tempData, email: e.target.value})}
                              className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${darkMode 
                                ? 'bg-gray-700 border-gray-600 focus:ring-purple-500 text-white' 
                                : 'bg-white border-gray-300 focus:ring-blue-500 text-gray-900'
                              }`}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <Mail size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                              <p className={darkMode ? 'text-gray-100' : 'text-gray-900'}>{userData.email}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={tempData.phone}
                              onChange={(e) => setTempData({...tempData, phone: e.target.value})}
                              className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${darkMode 
                                ? 'bg-gray-700 border-gray-600 focus:ring-purple-500 text-white' 
                                : 'bg-white border-gray-300 focus:ring-blue-500 text-gray-900'
                              }`}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <Phone size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                              <p className={darkMode ? 'text-gray-100' : 'text-gray-900'}>{userData.phone}</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={tempData.location}
                              onChange={(e) => setTempData({...tempData, location: e.target.value})}
                              className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${darkMode 
                                ? 'bg-gray-700 border-gray-600 focus:ring-purple-500 text-white' 
                                : 'bg-white border-gray-300 focus:ring-blue-500 text-gray-900'
                              }`}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <Globe size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                              <p className={darkMode ? 'text-gray-100' : 'text-gray-900'}>{userData.location}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bio</label>
                        {isEditing ? (
                          <textarea
                            value={tempData.bio}
                            onChange={(e) => setTempData({...tempData, bio: e.target.value})}
                            className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 min-h-[100px] ${darkMode 
                              ? 'bg-gray-700 border-gray-600 focus:ring-purple-500 text-white' 
                              : 'bg-white border-gray-300 focus:ring-blue-500 text-gray-900'
                            }`}
                          />
                        ) : (
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} italic`}>{userData.bio}</p>
                        )}
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Member Since</label>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{userData.joinDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'notes' && (
                <motion.div 
                  key="notes"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm p-6`}
                >
                  <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Notebook size={20} className="text-purple-400" />
                    My Notes
                  </h2>
                  <div className={`rounded-lg divide-y ${darkMode ? 'divide-gray-700 border-gray-700' : 'divide-gray-200 border-gray-200'} border`}>
                    {[1, 2, 3].map(note => (
                      <motion.div 
                        key={note}
                        whileHover={{ scale: 1.01 }}
                        className={`p-4 transition cursor-pointer ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{note === 1 ? 'Project Kickoff Meeting' : note === 2 ? 'Design System Notes' : 'Personal Journal'}</h3>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {note === 1 ? 'Yesterday' : note === 2 ? '3 days ago' : '1 week ago'}
                          </span>
                        </div>
                        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {note === 1 ? 'Key decisions and action items from the project kickoff meeting...' : 
                           note === 2 ? 'Components and patterns for our new design system implementation...' : 
                           'Personal reflections and ideas from this week...'}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800'}`}>
                            {note === 1 ? 'Work' : note === 2 ? 'Design' : 'Personal'}
                          </span>
                          {note === 1 && (
                            <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full">
                              Meeting
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div 
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm p-6`}
                >
                  <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Lock size={20} className="text-blue-400" />
                    Security Settings
                  </h2>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            <Lock size={18} className="text-green-400" />
                            Password
                          </h3>
                          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last changed 3 months ago</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                        >
                          Change Password
                        </motion.button>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            <Key size={18} className="text-yellow-400" />
                            Two-Factor Authentication
                          </h3>
                          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add an extra layer of security</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-gray-200`}
                        >
                          Enable
                        </motion.button>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            <Globe size={18} className="text-blue-400" />
                            Active Sessions
                          </h3>
                          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>2 active sessions</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                        >
                          View All
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab !== 'overview' && activeTab !== 'notes' && activeTab !== 'security' && (
                <motion.div 
                  key="coming-soon"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px]`}
                >
                  <div className="text-center p-6">
                    <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
                      {tabs.find(t => t.id === activeTab)?.icon}
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      {tabs.find(t => t.id === activeTab)?.label}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                      This section is coming soon. We're working on it!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-sm font-medium`}
                    >
                      Notify Me When Ready
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}