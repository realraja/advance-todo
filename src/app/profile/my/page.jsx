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
  Calendar
} from 'lucide-react';
import { useSelector } from 'react-redux';
import ProfileEditDialog from '@/components/profile/editProfileDialog';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState({});
  const [showEditProfile, setShowEditProfile] = useState(false);

  const { userData:data } = useSelector(state => state.auth);

  useEffect(() => {
  setUserData(data)
  }, [data]);



  const tabs = [
    { id: 'overview', icon: <User size={18} />, label: 'Overview' },
    { id: 'event', icon: <Star size={18} />, label: 'Events' },
    { id: 'brush', icon: <CalendarArrowUp size={18} />, label: 'Brush' },
    { id: 'bath', icon: <CalendarArrowUp size={18} />, label: 'Bath' },
    { id: 'run', icon: <Goal size={18} />, label: 'Runing' },
    { id: 'doThat', icon: <CalendarDaysIcon size={18} />, label: 'Did' },
  ];

  return (
    <div className="w-full flex-shrink-0">
      <div className={`rounded-xl shadow-sm p-6 sticky top-8`}>
        {/* Profile Summary */}
        <div className="text-center flex justify-around p-5 items-center mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <img
              src={userData.imgUrl}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-gray-800 shadow-lg"
            />
            <motion.button
            onClick={()=> setShowEditProfile(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute cursor-pointer bottom-0 right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-1.5 rounded-full shadow-md"
            >
              <Edit size={14} />
            </motion.button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col gap-5"
          >
            <p className="text-xl border-b w-full text-center pb-1">Details</p>
            <div className="flex rounded-xl w-full bg-gray-800 hover:bg-gray-700 items-center py-2 px-8 gap-5 cursor-pointer ">
              <User2 className='size-6' />
              <div>
                <p className="text-sm text-start text-gray-400"> Name </p>
                <h3 className="font-bold">{userData.name}</h3>
              </div>
            </div>
            <div className="flex items-center rounded-xl w-full bg-gray-800 hover:bg-gray-700 py-2 px-8 gap-5 cursor-pointer ">
              <Mail className='size-6' />
              <div>
                <p className="text-sm text-start text-gray-400"> Email </p>
                <h3 className="font-bold">{userData.email}</h3>
              </div>
            </div>
            <div className="flex items-center rounded-xl w-full bg-gray-800 hover:bg-gray-700 py-2 px-8 gap-5 cursor-pointer ">
              <Calendar className='size-6' />
              <div>
                <p className="text-sm text-start text-gray-400"> Date of Birth </p>
                <h3 className="font-bold">{userData?.dob?.split('T')[0]}</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <nav className="space-1 py-2 flex border-t overflow-auto scrollEditclass">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ x: 5 }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition ${activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-400 border border-purple-500/20'
                : 'text-gray-400 hover:bg-gray-700/50'
                }`}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </nav>
      </div>

      <ProfileEditDialog show={showEditProfile} setShow={setShowEditProfile} initialData={userData} />
    </div>
  );
}