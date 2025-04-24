"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Calendar, ChevronRight, Sparkles, Check, CheckCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
// import { useAddBrushMutation, useGetrunDatesQuery } from '@/redux/api/user';
import { format, isToday, isYesterday, parseISO, eachDayOfInterval, subDays } from 'date-fns';
import {   useGetRunQuery } from '@/redux/api/user';

export default function RunningPage() {
  const [runDates, setRunDates] = useState([]);
  const [streakCount, setStreakCount] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  
  const { data } = useGetRunQuery();

  // console.log(runDates,data)

  useEffect(() => {
    if (data?.data?.run) {
      const dates = data.data.run.map(date => parseISO(date));
      setRunDates(dates);
      calculateStreak(dates);
    }
  }, [data]);

  const calculateStreak = (dates) => {
    if (dates.length === 0) {
      setStreakCount(0);
      return;
    }

    const sortedDates = [...dates].sort((a, b) => b - a);
    let streak = 0;
    let currentDate = new Date();

    // Reset time to compare only dates
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const brushDate = new Date(sortedDates[i]);
      brushDate.setHours(0, 0, 0, 0);

      if (i === 0 && isToday(brushDate)) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else if (brushDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }

    setStreakCount(streak);
  };




  const renderLast30Days = () => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 29);
    const dateRange = eachDayOfInterval({ start: thirtyDaysAgo, end: today }).reverse();

    return dateRange.map((day) => {
      const formattedDay = format(day, 'yyyy-MM-dd');
      const isBrushed = runDates.some(date => format(date, 'yyyy-MM-dd') === formattedDay);
      const dayName = format(day, 'EEE');
      const dayNumber = format(day, 'd');
      const isCurrentDay = isToday(day);

      return (
        <motion.div
          key={formattedDay}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className={`relative flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all ${
            isBrushed 
              ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30'
              : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50'
          } ${isCurrentDay ? 'ring-2 ring-purple-500/50' : ''}`}
        >
          <span className="text-xs text-gray-400">{dayName}</span>
          <span className={`text-lg font-medium ${
            isBrushed ? 'text-white' : 'text-gray-400'
          }`}>{dayNumber}</span>
          {isBrushed && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 p-1 bg-green-500 rounded-full"
            >
              <Check className="text-white" size={12} />
            </motion.div>
          )}
        </motion.div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Droplet className="text-blue-400" size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Running Tracker
            </h1>
          </motion.div>
          
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Current Streak</p>
                <h3 className="text-2xl font-bold text-white">{streakCount} days</h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Sparkles className="text-blue-400" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Brushed</p>
                <h3 className="text-2xl font-bold text-white">{runDates.length} days</h3>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Droplet className="text-purple-400" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Last Brushed</p>
                <h3 className="text-2xl font-bold text-white">
                  {runDates.length > 0 ? 
                    isToday(runDates[0]) ? 'Today' : 
                    isYesterday(runDates[0]) ? 'Yesterday' : 
                    format(runDates[0], 'MMM d') : 'Never'}
                </h3>
              </div>
              <div className="p-3 bg-cyan-500/10 rounded-lg">
                <Calendar className="text-cyan-400" size={20} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-300">Last 30 Days</h2>
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
              <motion.span
                animate={{ rotate: showCalendar ? 90 : 0 }}
              >
                <ChevronRight size={16} />
              </motion.span>
            </button>
          </div>

          <AnimatePresence>
            {showCalendar && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-7 gap-2">
                  {renderLast30Days()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recent Running History */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-semibold text-gray-300 mb-4">Running History</h2>
          {runDates.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence>
                {runDates.slice(0, 10).map((date, index) => (
                  <motion.div
                    key={date.getTime()}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Droplet className="text-blue-400" size={16} />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {isToday(date) ? 'Today' : 
                           isYesterday(date) ? 'Yesterday' : 
                           format(date, 'MMMM d, yyyy')}
                        </h3>
                        <p className="text-xs text-gray-400">{format(date, 'EEEE')}</p>
                      </div>
                    </div>
                    <button 
                      className="p-2 text-green-400 hover:text-red-400 rounded-full transition-all"
                    >
                      <CheckCheck size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-dashed border-gray-700/50">
              <Droplet className="mx-auto text-gray-600 mb-4" size={32} />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No Running history yet</h3>
              <p className="text-gray-500 mb-4">Start tracking your Running habits by adding your first entry</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}