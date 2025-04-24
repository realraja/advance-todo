'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Edit, CalendarArrowUp, CalendarDaysIcon, Goal, Star, User2, Mail, Calendar,
  ChevronRight, Award, Activity, Droplet, CheckCircle, HeartPulse
} from 'lucide-react';
import { useSelector } from 'react-redux';
import ProfileEditDialog from '@/components/profile/editProfileDialog';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState({});
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  const { userData: data } = useSelector(state => state.auth);

  useEffect(() => {
    setUserData(data);
  }, [data]);

  const tabs = [
    { id: 'overview', icon: <User size={18} />, label: 'Overview' },
    { id: 'event', icon: <Award size={18} />, label: 'Events' },
    { id: 'brush', icon: <Droplet size={18} />, label: 'Brush' },
    { id: 'bath', icon: <Activity size={18} />, label: 'Bath' },
    { id: 'run', icon: <HeartPulse size={18} />, label: 'Running' },
    { id: 'doThat', icon: <CheckCircle size={18} />, label: 'Achievements' },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Profile Header */}
        <div className="relative rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 shadow-xl overflow-hidden mb-8">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Section */}
            <motion.div
              className="relative group"
              onHoverStart={() => setIsHoveringAvatar(true)}
              onHoverEnd={() => setIsHoveringAvatar(false)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden">
                <img
                  src={userData.imgUrl || '/default-avatar.jpg'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <AnimatePresence>
                  {isHoveringAvatar && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center"
                    >
                      <motion.button
                        onClick={() => setShowEditProfile(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-2 rounded-full shadow-lg"
                      >
                        <Edit size={18} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <motion.div 
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-1 rounded-full shadow-md"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
              >
                <span className="text-xs font-semibold">PRO MEMBER</span>
              </motion.div>
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {userData.name || 'Your Name'}
              </motion.h1>
              
              <motion.p 
                className="text-gray-300 max-w-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome to your personal dashboard! Track your activities, achievements, and progress.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap justify-center md:justify-start gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-gray-700/50 hover:bg-gray-600/50 transition rounded-full px-4 py-1.5 text-sm flex items-center gap-2">
                  <Star size={14} className="text-yellow-400" />
                  <span>Gold Member</span>
                </div>
                <div className="bg-gray-700/50 hover:bg-gray-600/50 transition rounded-full px-4 py-1.5 text-sm flex items-center gap-2">
                  <CalendarDaysIcon size={14} className="text-blue-400" />
                  <span>Joined 2023</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Details Card */}
            <motion.div 
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User2 size={20} className="text-purple-400" />
                Personal Details
              </h2>
              
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center gap-3 p-3 hover:bg-gray-700/30 rounded-lg transition cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Mail size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="font-medium">{userData.email || 'user@example.com'}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-3 p-3 hover:bg-gray-700/30 rounded-lg transition cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Calendar size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date of Birth</p>
                    <p className="font-medium">{userData?.dob?.split('T')[0] || 'Not set'}</p>
                  </div>
                </motion.div>
                
                <motion.button
                  onClick={() => setShowEditProfile(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/30 text-purple-400 hover:text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Edit size={16} />
                  Edit Profile
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div 
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity size={20} className="text-blue-400" />
                Your Stats
              </h2>
              
              <div className="space-y-4">
                {[
                  { icon: <Star size={16} className="text-yellow-400" />, label: 'Points', value: '1,245' },
                  { icon: <Award size={16} className="text-purple-400" />, label: 'Achievements', value: '12' },
                  { icon: <HeartPulse size={16} className="text-red-400" />, label: 'Streak', value: '7 days' },
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="flex justify-between items-center p-3 hover:bg-gray-700/30 rounded-lg transition cursor-pointer"
                    whileHover={{ x: 5 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-700/50 rounded-lg">
                        {stat.icon}
                      </div>
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <span className="font-semibold">{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs Navigation */}
            <motion.nav 
              className="flex overflow-x-auto scrollEditclass gap-1 p-1 bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-inner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {tabs.map(tab => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-lg transition flex items-center gap-2 ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 shadow-md'
                    : 'text-gray-400 hover:bg-gray-700/50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </motion.button>
              ))}
            </motion.nav>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 shadow-lg min-h-[400px]"
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <User size={20} className="text-purple-400" />
                    Overview
                  </h2>
                  <p className="text-gray-300">
                    Welcome to your personal dashboard. Here you can see your recent activities, progress, and achievements.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(item => (
                      <motion.div
                        key={item}
                        whileHover={{ y: -5 }}
                        className="bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl p-4 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Activity size={18} className="text-purple-400" />
                          </div>
                          <h3 className="font-semibold">Recent Activity {item}</h3>
                        </div>
                        <p className="text-sm text-gray-400">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                        </p>
                        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                          <span>2 days ago</span>
                          <ChevronRight size={16} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab !== 'overview' && (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="p-4 bg-gray-700/50 rounded-full mb-4">
                    {tabs.find(t => t.id === activeTab)?.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {tabs.find(t => t.id === activeTab)?.label} Section
                  </h3>
                  <p className="text-gray-400 max-w-md text-center">
                    This section is under development. You'll be able to view your {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} details here soon.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <ProfileEditDialog 
        show={showEditProfile} 
        setShow={setShowEditProfile} 
        initialData={userData} 
      />
    </div>
  );
}