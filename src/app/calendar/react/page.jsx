"use client"
import { useState } from "react";
import { format, addDays, subDays, isToday, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([
    { title: "Event 1", time: "10:00 AM - 11:00 AM" },
    { title: "Event 2", time: "10:00 AM - 11:00 AM" },
  ]);

  const start = startOfMonth(selectedDate);
  const end = endOfMonth(selectedDate);
  const monthDays = eachDayOfInterval({ start, end });

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 flex flex-col items-center">
      <div className="bg-[#1E293B] rounded-xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{format(selectedDate, "LLLL yyyy")}</h2>
          <label className="relative cursor-pointer">
            <input
              type="date"
              onChange={handleDateChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <FaCalendarAlt className="text-2xl text-gray-400 hover:text-white" />
          </label>
        </div>

        {/* Top Dates Row */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setSelectedDate(subDays(selectedDate, 1))}>◀</button>
          <div className="flex gap-2">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const date = addDays(selectedDate, offset);
              const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
              return (
                <div
                  key={offset}
                  onClick={() => setSelectedDate(date)}
                  className={`w-10 h-10 flex flex-col items-center justify-center rounded-full cursor-pointer transition-all 
                    ${isSelected ? "bg-violet-600 text-white" : "hover:bg-gray-700 text-gray-300"}`}
                >
                  <div className="text-xs">{format(date, "EEE")}</div>
                  <div className="font-semibold">{format(date, "d")}</div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setSelectedDate(addDays(selectedDate, 1))}>▶</button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((d,i) => (
            <div key={i} className="text-center text-sm text-gray-400">
              {d}
            </div>
          ))}
          <AnimatePresence>
            {monthDays.map((date, index) => {
              const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedDate(date)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition 
                    ${isSelected ? "bg-violet-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}
                >
                  {format(date, "d")}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Events */}
        <div className="bg-[#1E293B] rounded-lg p-4">
          <h3 className="font-semibold mb-2">
            Today's Events {format(selectedDate, "EEEE, MMMM d")}
          </h3>
          <div className="space-y-2">
            {events.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#0F172A] rounded-lg px-4 py-2 shadow-md"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="font-medium">{event.title}</span>
                </div>
                <div className="text-sm text-gray-400">{event.time}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;



// 'use client'
// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronUp, ChevronDown } from 'lucide-react'
// import { FaCalendarAlt } from 'react-icons/fa'

// export default function CalendarPage() {
//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const [showCalendarGrid, setShowCalendarGrid] = useState(false)
//   // const [dateInputVisible, setDateInputVisible] = useState(false)
//   // const [customDate, setCustomDate] = useState('')

//   // Generate dates for the header (7 days including today)
//   const getHeaderDates = () => {
//     const dates = []
//     const today = new Date(selectedDate)

//     // Add 3 previous days
//     for (let i = 3; i > 0; i--) {
//       const date = new Date(today)
//       date.setDate(date.getDate() - i)
//       dates.push(date)
//     }

//     // Add today
//     dates.push(new Date(today))

//     // Add 3 next days
//     for (let i = 1; i <= 3; i++) {
//       const date = new Date(today)
//       date.setDate(date.getDate() + i)
//       dates.push(date)
//     }

//     return dates
//   }

//   const formatDay = (date) => {
//     return date.toLocaleDateString('en-US', { weekday: 'short' })
//   }

//   const formatDateNum = (date) => {
//     return date.getDate()
//   }

//   const isSameDay = (date1, date2) => {
//     return (
//       date1.getDate() === date2.getDate() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getFullYear() === date2.getFullYear()
//     )
//   }

//   const handleDateSelect = (date) => {
//     setSelectedDate(new Date(date))
//   }

//   const navigateDay = (direction) => {
//     const newDate = new Date(selectedDate)
//     newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
//     setSelectedDate(newDate)
//   }

//   const handleCustomDateSelect = (e) => {
//     if (e.target.value) {
//       setSelectedDate(new Date(e.target.value))
//     }
//   }

//   // Generate calendar days for the current month view
//   const getCalendarDays = () => {
//     const year = selectedDate.getFullYear()
//     const month = selectedDate.getMonth()
//     const firstDay = new Date(year, month, 1)
//     const lastDay = new Date(year, month + 1, 0)

//     const days = []
//     const startDay = firstDay.getDay()

//     // Add empty cells for days before the first day of month
//     for (let i = 0; i < startDay; i++) {
//       days.push(null)
//     }

//     // Add all days of the month
//     for (let i = 1; i <= lastDay.getDate(); i++) {
//       days.push(new Date(year, month, i))
//     }

//     return days
//   }

//   // Auto-hide date input when clicked outside


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Calendar Header */}
//         <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg p-4 mb-4">
//           <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
//             <h2 className="text-xl font-semibold text-white">
//               {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//             </h2>

//             <div className="flex items-center gap-2">
//               {/* <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setDateInputVisible(!dateInputVisible)}
//                 className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-white transition"
//               >
//                 <CalendarIcon size={18} />
//               </motion.button> */}
//               <label className="relative cursor-pointer">
//                       <input
//                         type="date"
//                   onChange={handleCustomDateSelect}
//                         className="absolute inset-0 opacity-0 cursor-pointer"
//                       />
//                       <FaCalendarAlt className="text-2xl text-gray-400 hover:text-white" />
//                     </label>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowCalendarGrid(!showCalendarGrid)}
//                 className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-white transition"
//               >
//                 {showCalendarGrid ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </motion.button>
//             </div>
//           </div>

//           {/* Date Input (visible when calendar icon clicked) */}
//           {/* <AnimatePresence>
//             {dateInputVisible && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="date-input-container overflow-hidden mb-3"
//               >
//                 <input
//                   type="date"
//                   onChange={handleCustomDateSelect}
//                   className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
//                 />
//               </motion.div>
//             )}
//           </AnimatePresence> */}
          

//           {/* Date Navigation */}
//           <div className="flex items-center justify-between">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => navigateDay('prev')}
//               className="p-2 rounded-full hover:bg-gray-700/50 transition"
//             >
//               <ChevronLeft size={24} className="text-gray-300" />
//             </motion.button>

//             <div className="flex-1 flex items-center justify-center gap-1 overflow-hidden px-1">
//               {getHeaderDates().map((date, index) => (
//                 <motion.button
//                   key={index}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => handleDateSelect(date)}
//                   className={`flex flex-col items-center justify-center p-2 rounded-full aspect-square w-12 h-12 transition ${isSameDay(date, selectedDate)
//                       ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
//                       : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
//                     }`}
//                 >
//                   <span className="text-xs">{formatDay(date)}</span>
//                   <span className="font-medium text-sm">{formatDateNum(date)}</span>
//                 </motion.button>
//               ))}
//             </div>

//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => navigateDay('next')}
//               className="p-2 rounded-full hover:bg-gray-700/50 transition"
//             >
//               <ChevronRight size={24} className="text-gray-300" />
//             </motion.button>
//           </div>
//         </div>

//         {/* Calendar Grid */}
//         <AnimatePresence>
//           {showCalendarGrid && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden mb-4"
//             >
//               <div className="p-4">
//                 <div className="grid grid-cols-7 gap-1 mb-2">
//                   {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
//                     <div key={`${day}-${index}`} className="text-center text-gray-400 text-xs font-medium py-1">
//                       {day}
//                     </div>
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-7 gap-1">
//                   {getCalendarDays().map((date, index) => (
//                     <motion.button
//                       key={index}
//                       whileHover={{ scale: 0.95 }}
//                       whileTap={{ scale: 0.9 }}
//                       onClick={() => date && handleDateSelect(date)}
//                       className={`aspect-square rounded-full flex items-center justify-center text-sm transition ${date
//                           ? isSameDay(date, selectedDate)
//                             ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
//                             : date.getMonth() === selectedDate.getMonth()
//                               ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
//                               : 'bg-gray-800/30 text-gray-500'
//                           : 'bg-transparent'
//                         }`}
//                     >
//                       {date && date.getDate()}
//                     </motion.button>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Selected Date Events */}
//         <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg p-4">
//           <h3 className="text-lg font-semibold text-white mb-4">
//             {isSameDay(selectedDate, new Date()) ? "Today's Events" : "Events on"} {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
//           </h3>

//           {isSameDay(selectedDate, new Date()) ? (
//             <div className="space-y-3">
//               {[1, 2, 3].map((event) => (
//                 <motion.div
//                   key={event}
//                   whileHover={{ x: 5 }}
//                   className="bg-gray-700/50 hover:bg-gray-600/50 rounded-lg p-3 border border-gray-600/50 transition cursor-pointer"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
//                     <div>
//                       <h4 className="font-medium text-gray-200">Event {event}</h4>
//                       <p className="text-xs text-gray-400">10:00 AM - 11:00 AM</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-6">
//               <div className="mx-auto w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
//                 <CalendarIcon size={24} className="text-gray-500" />
//               </div>
//               <h4 className="text-lg font-medium text-gray-200 mb-2">No events scheduled</h4>
//               <p className="text-gray-400">You have no events on this day</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }