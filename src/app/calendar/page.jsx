'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronUp, ChevronDown } from 'lucide-react'
import { FaCalendarAlt } from 'react-icons/fa'
import HomePage from '../../components/calendar/HomePage'
import { useSelector } from 'react-redux'
import CalendarIntroduction from '@/components/calendar/introPage'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCalendarGrid, setShowCalendarGrid] = useState(false)
  const [isToday, setIsToday] = useState(true)
  const dateInputRef = useRef(null);

  const {isUser} = useSelector(state=> state.auth);

  // Check if selected date is today
  useEffect(() => {
    const today = new Date()
    setIsToday(
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    )
  }, [selectedDate])

  // Generate dates for the header (7 days including today)
  const getHeaderDates = () => {
    const dates = []
    const today = new Date(selectedDate)

    // Add 3 previous days
    for (let i = 3; i > 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      dates.push(date)
    }

    // Add today
    dates.push(new Date(today))

    // Add 3 next days
    for (let i = 1; i <= 3; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      dates.push(date)
    }

    return dates
  }

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 2)
  }

  const formatDateNum = (date) => {
    return date.getDate()
  }

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const handleDateSelect = (date) => {
    setSelectedDate(new Date(date))
  }

  const navigateDay = (direction) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    setSelectedDate(newDate)
  }

  const handleCustomDateSelect = (e) => {
    if (e.target.value) {
      setSelectedDate(new Date(e.target.value))
    }
  }

  const jumpToToday = () => {
    setSelectedDate(new Date())
    setShowCalendarGrid(false)
  }

  // Generate calendar days for the current month view
  const getCalendarDays = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []
    const startDay = firstDay.getDay()

    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  if(!isUser) return <CalendarIntroduction />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Calendar Header */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex justify-between items-center mb-3 sm:mb-4 flex-wrap gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>

            <div className="flex items-center gap-2">
              {/* Today Button - Only show when not on today */}
              {!isToday && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={jumpToToday}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-white text-sm transition"
                >
                  Today
                </motion.button>
              )}

              <label className="relative cursor-pointer">
                <input
                  type="date"
                  ref={dateInputRef}
                  onChange={handleCustomDateSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <FaCalendarAlt className="text-xl sm:text-2xl text-gray-400 hover:text-white transition" />
              </label>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCalendarGrid(!showCalendarGrid)}
                className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 p-1 sm:p-2 rounded-lg text-white transition"
              >
                {showCalendarGrid ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </motion.button>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateDay('prev')}
              className="p-1 sm:p-2 rounded-full hover:bg-gray-700/50 transition"
            >
              <ChevronLeft size={20} className="text-gray-300" />
            </motion.button>

            <div className="flex-1 flex items-center justify-center gap-0 sm:gap-1 overflow-x-auto px-1 hide-scrollbar">
              {getHeaderDates().map((date, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateSelect(date)}
                  className={`flex flex-col items-center justify-center p-1 sm:p-2 rounded-full aspect-square w-10 h-10 sm:w-12 sm:h-12 transition ${
                    isSameDay(date, selectedDate)
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                      : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
                  }`}
                >
                  <span className="text-xs">{formatDay(date)}</span>
                  <span className="font-medium text-sm">{formatDateNum(date)}</span>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateDay('next')}
              className="p-1 sm:p-2 rounded-full hover:bg-gray-700/50 transition"
            >
              <ChevronRight size={20} className="text-gray-300" />
            </motion.button>
          </div>
        </div>

        {/* Calendar Grid */}
        <AnimatePresence>
          {showCalendarGrid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden mb-3 sm:mb-4"
            >
              <div className="p-2 sm:p-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={`${day}-${index}`} className="text-center text-gray-400 text-xs font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {getCalendarDays().map((date, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 0.95 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => date && handleDateSelect(date)}
                      className={`aspect-square rounded-full flex items-center justify-center text-xs sm:text-sm transition ${
                        date
                          ? isSameDay(date, selectedDate)
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                            : date.getMonth() === selectedDate.getMonth()
                            ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
                            : 'bg-gray-800/30 text-gray-500'
                          : 'bg-transparent'
                      }`}
                    >
                      {date && date.getDate()}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Date Events */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            {isSameDay(selectedDate, new Date())
              ? "Today's Events"
              : `Events on ${selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}`}
          </h3>

    <HomePage date={selectedDate} />
          {/* {isSameDay(selectedDate, new Date()) ? (
            <div className="space-y-2 sm:space-y-3">
              {[1, 2, 3].map((event) => (
                <motion.div
                  key={event}
                  whileHover={{ x: 5 }}
                  className="bg-gray-700/50 hover:bg-gray-600/50 rounded-lg p-2 sm:p-3 border border-gray-600/50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-200 text-sm sm:text-base">Event {event}</h4>
                      <p className="text-xs text-gray-400">10:00 AM - 11:00 AM</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 sm:py-6">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <CalendarIcon size={20} className="text-gray-500" />
              </div>
              <h4 className="text-base sm:text-lg font-medium text-gray-200 mb-1 sm:mb-2">
                No events scheduled
              </h4>
              <p className="text-gray-400 text-sm sm:text-base">You have no events on this day</p>
            </div>
          )} */}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}