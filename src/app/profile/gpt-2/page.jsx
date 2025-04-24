'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Edit,
  CalendarArrowUp,
  CalendarDaysIcon,
  Goal,
  Star,
  User2,
  Mail,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import ProfileEditDialog from '@/components/profile/editProfileDialog';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState({});
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { userData: data } = useSelector(state => state.auth);

  useEffect(() => {
    setUserData(data);
  }, [data]);

  const tabs = [
    { id: 'overview', icon: <User size={18} />, label: 'Overview' },
    { id: 'event', icon: <Star size={18} />, label: 'Events' },
    { id: 'brush', icon: <CalendarArrowUp size={18} />, label: 'Brush' },
    { id: 'bath', icon: <CalendarArrowUp size={18} />, label: 'Bath' },
    { id: 'run', icon: <Goal size={18} />, label: 'Running' },
    { id: 'doThat', icon: <CalendarDaysIcon size={18} />, label: 'Activities' },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Profile Header */}
        <div className="relative rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/70 border border-gray-700/50 shadow-xl overflow-hidden">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-blue-500/10 opacity-30"></div>
          
          {/* Profile Content */}
          <div className="relative z-10 p-8">
            {/* Profile Summary */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Profile Picture */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="relative group"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <div className="relative w-48 h-48 rounded-full border-4 border-purple-500/30 shadow-2xl overflow-hidden">
                  <img
                    src={userData.imgUrl || '/default-avatar.jpg'}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center"
                      >
                        <motion.button
                          onClick={() => setShowEditProfile(true)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3 rounded-full shadow-lg"
                        >
                          <Edit size={20} />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.div 
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  @{userData.username || 'user'}
                </motion.div>
              </motion.div>

              {/* Profile Details */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex-1 space-y-4"
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {userData.name || 'User Name'}
                </h1>
                <p className="text-gray-300 max-w-lg">
                  {userData.bio || 'No bio added yet. Click edit to add your personal bio.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <motion.div 
                    whileHover={{ y: -3 }}
                    className="bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/10 rounded-full">
                        <Mail className="text-purple-400" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <h3 className="font-medium text-white">{userData.email || 'example@email.com'}</h3>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -3 }}
                    className="bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-full">
                        <Calendar className="text-blue-400" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Date of Birth</p>
                        <h3 className="font-medium text-white">
                          {userData?.dob?.split('T')[0] || 'Not specified'}
                        </h3>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -3 }}
                    className="bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 rounded-full">
                        <CalendarDaysIcon className="text-green-400" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Member Since</p>
                        <h3 className="font-medium text-white">
                          {new Date(userData?.createdAt).toLocaleDateString() || 'Unknown'}
                        </h3>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -3 }}
                    className="bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-500/10 rounded-full">
                        <Star className="text-yellow-400" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Achievements</p>
                        <h3 className="font-medium text-white">15 Completed</h3>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Tabs */}
            <nav className="mt-8 flex overflow-x-auto scrollEditclass pb-2">
              <div className="flex space-x-2">
                {tabs.map(tab => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600/30 to-blue-500/30 text-purple-400 border border-purple-500/30 shadow-md shadow-purple-500/10'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                      }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.span
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="ml-1"
                      >
                        <ChevronRight size={16} />
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm"
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(item => (
                <motion.div
                  key={item}
                  whileHover={{ y: -5 }}
                  className="bg-gray-800/70 hover:bg-gray-700/70 rounded-xl p-5 border border-gray-700/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">Activity {item}</h3>
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <CalendarArrowUp className="text-purple-400" size={18} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-500">2 days ago</span>
                    <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                      View <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {activeTab !== 'overview' && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                {tabs.find(t => t.id === activeTab)?.icon || <User size={32} className="text-gray-500" />}
              </div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">
                {tabs.find(t => t.id === activeTab)?.label} Content
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                This section will display your {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} activities and history.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>

      <ProfileEditDialog 
        show={showEditProfile} 
        setShow={setShowEditProfile} 
        initialData={userData} 
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}