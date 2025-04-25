'use client'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Award, Film, BookOpen, Check, Activity, Droplet, Star, Target } from 'lucide-react'
import { FaTooth } from 'react-icons/fa'
import dayjs from 'dayjs'

export default function CalendarIntroduction() {
  // Sample important dates from your history
  const importantDates = [
    {
      date: '2002-05-18',
      title: 'Your Birthday',
      description: 'The day you were born - the beginning of an amazing journey!',
      icon: <Star className="text-yellow-400" />,
      color: 'bg-yellow-500/20'
    },
    {
      date: '2002-03-14',
      title: 'Gagan Birthday',
      description: 'Your friend Gagan\'s special day each year',
      icon: <Star className="text-blue-400" />,
      color: 'bg-blue-500/20'
    },
    {
      date: '2007-02-22',
      title: 'Neeraj',
      description: 'An important person in your life',
      icon: <Star className="text-purple-400" />,
      color: 'bg-purple-500/20'
    },
    {
      date: '2025-04-19',
      title: 'Account Created',
      description: 'The day you started organizing your life with this app',
      icon: <CalendarIcon className="text-green-400" />,
      color: 'bg-green-500/20'
    }
  ]

  // Stats about your activities
  const stats = [
    { 
      title: 'Days Tracked', 
      value: '287', 
      icon: <CalendarIcon className="text-purple-400" />,
      description: 'Consistent tracking since joining'
    },
    { 
      title: 'Goals Achieved', 
      value: '42', 
      icon: <Target className="text-green-400" />,
      description: 'Milestones reached successfully'
    },
    { 
      title: 'Skills Practiced', 
      value: '8', 
      icon: <Award className="text-blue-400" />,
      description: 'Different skills you\'re mastering'
    },
    { 
      title: 'Movies/Series', 
      value: '15', 
      icon: <Film className="text-yellow-400" />,
      description: 'Entertainment you\'ve logged'
    }
  ]

  // Habit streaks
  const habits = [
    {
      name: 'Brushed Teeth',
      streak: '14 days',
      icon: <FaTooth className="text-white" />,
      color: 'bg-blue-500'
    },
    {
      name: 'Bathed',
      streak: '10 days',
      icon: <Droplet className="text-white" />,
      color: 'bg-purple-500'
    },
    {
      name: 'Running',
      streak: '7 days',
      icon: <Activity className="text-white" />,
      color: 'bg-green-500'
    },
    {
      name: 'Did That',
      streak: '5 days',
      icon: <Check className="text-white" />,
      color: 'bg-yellow-500'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Your Life Calendar
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          A beautiful timeline of your achievements, habits, and special moments. 
          Every day is a new chapter in your story.
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-gray-700/50 mr-4">
                {stat.icon}
              </div>
              <h3 className="text-xl font-semibold text-white">{stat.title}</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
            <p className="text-gray-400">{stat.description}</p>
          </div>
        ))}
      </motion.div>

      {/* Important Dates */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Star className="text-yellow-400 mr-2" />
          Important Dates in Your Life
        </h2>
        <div className="space-y-4">
          {importantDates.map((event, index) => (
            <div 
              key={index} 
              className={`p-5 rounded-xl ${event.color} border border-gray-700/50 backdrop-blur-sm`}
            >
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-gray-900/50 mr-4 mt-1">
                  {event.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                  <p className="text-gray-300 mb-2">{dayjs(event.date).format('MMMM D, YYYY')}</p>
                  <p className="text-gray-400">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Current Habit Streaks */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Activity className="text-purple-400 mr-2" />
          Your Current Habit Streaks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {habits.map((habit, index) => (
            <div 
              key={index} 
              className={`${habit.color} rounded-xl p-6 shadow-lg transform hover:scale-105 transition duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-full bg-black/20">
                  {habit.icon}
                </div>
                <span className="text-sm font-medium text-white/80">Current Streak</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{habit.name}</h3>
              <p className="text-2xl font-bold text-white">{habit.streak}</p>
              <div className="w-full bg-white/20 h-1 mt-3 rounded-full overflow-hidden">
                <div 
                  className="bg-white h-1 rounded-full" 
                  style={{ width: `${Math.min(100, 70 + index * 10)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Achievements */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Award className="text-yellow-400 mr-2" />
          Recent Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample achievement 1 */}
          <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/30 rounded-xl p-6 border border-purple-500/30 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-purple-500/20 mr-3">
                <Target className="text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Flute Practice</h3>
            </div>
            <p className="text-gray-300 mb-3">Reached Intermediate level in flute playing</p>
            <div className="flex items-center text-sm text-purple-300">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>Achieved on {dayjs().subtract(2, 'days').format('MMMM D')}</span>
            </div>
          </div>
          
          {/* Sample achievement 2 */}
          <div className="bg-gradient-to-br from-blue-900/50 to-green-900/30 rounded-xl p-6 border border-blue-500/30 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-blue-500/20 mr-3">
                <Check className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Running Streak</h3>
            </div>
            <p className="text-gray-300 mb-3">Completed 7 consecutive days of running</p>
            <div className="flex items-center text-sm text-blue-300">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>Achieved on {dayjs().subtract(1, 'day').format('MMMM D')}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Ready to Continue Your Journey?
        </h2>
        <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
          Every day is a new opportunity to grow, achieve, and create memories.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl transition"
        >
          Explore Your Calendar
        </motion.button>
      </motion.div>
    </div>
  )
}