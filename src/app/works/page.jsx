"use client";
import { useAddWorkMutation, useGetAllWorkQuery, useToggleCompleteWorkMutation } from "@/redux/api/work";
import { Edit, Info, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import UpdateTaskWorkFormDialog from "@/components/dialog/updateTaskWork";
import DetailAndDeleteTaskWork from "@/components/dialog/detailDeleteTaskWorkDialog";

const Page = () => {
    const [activeTab, setActiveTab] = useState("work");
    const [workArray, setWorkArray] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState({});
    const [showDetailDialog, setShowDetailDialog] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const { workData } = useSelector((state) => state.work);
    const [CreateWork, { isLoading }] = useAddWorkMutation();
    const [ToggleCompleteWork] = useToggleCompleteWorkMutation();
    const { data } = useGetAllWorkQuery();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (data) {
            setWorkArray(data?.data?.work || []);
        } else if (workData && Array.isArray(workData)) {
            setWorkArray(workData);
        }
    }, [data, workData]);


    const handleToggleCompletion = async (id) => {
        setWorkArray((prev) => {
            return prev.map((work) => {
                if (work._id === id) {
                    return { ...work, completed: !work.completed };
                }
                return work;
            })
        });
        await ToggleCompleteWork(id);
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedWorkArray = () => {
        const sortableItems = [...workArray];
        if (!sortConfig.key) return sortableItems;

        return sortableItems.sort((a, b) => {
            if (sortConfig.key === 'title') {
                const titleA = a.title.toLowerCase();
                const titleB = b.title.toLowerCase();
                if (titleA < titleB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (titleA > titleB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            }

            if (sortConfig.key === 'day') {
                const dayA = getDayDisplay(a.whenDoWork).text.toLowerCase();
                const dayB = getDayDisplay(b.whenDoWork).text.toLowerCase();
                if (dayA < dayB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (dayA > dayB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            }

            if (sortConfig.key === 'completed') {
                if (a.completed === b.completed) return 0;
                return sortConfig.direction === 'asc'
                    ? (a.completed ? 1 : -1)
                    : (a.completed ? -1 : 1);
            }
            if (sortConfig.key === 'clear') {
                return 
            }

            return 0;
        });
    };

    const getDayDisplay = (dayString) => {
        if (!dayString || dayString.toLowerCase() === 'anytime') {
            return {
                text: 'Anytime',
                shortText: 'Any',
                isToday: false,
                isTomorrow: false
            };
        }

        const today = new Date();
        const todayDayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDayName = tomorrow.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        const inputDay = dayString.toLowerCase();

        if (inputDay === todayDayName) {
            return {
                text: 'Today',
                shortText: 'Today',
                isToday: true,
                isTomorrow: false
            };
        }

        if (inputDay === tomorrowDayName) {
            return {
                text: 'Tomorrow',
                shortText: 'Tmrw',
                isToday: false,
                isTomorrow: true
            };
        }

        return {
            text: `Do on: ${dayString}`,
            shortText: dayString.slice(0, 3),
            isToday: false,
            isTomorrow: false
        };
    };

    const getDayColor = (day, isToday = false, isTomorrow = false) => {
        const dayLower = day.toLowerCase();

        if (isToday) return 'bg-red-500/30 text-red-400 font-bold animate-pulse';
        if (isTomorrow) return 'bg-orange-500/30 text-orange-400 font-semibold';

        switch (dayLower) {
            case 'sunday':
                return 'bg-red-500/20 text-red-400';
            case 'monday':
                return 'bg-blue-500/20 text-blue-400';
            case 'tuesday':
                return 'bg-purple-500/20 text-purple-400';
            case 'wednesday':
                return 'bg-green-500/20 text-green-400';
            case 'thursday':
                return 'bg-yellow-500/20 text-yellow-400';
            case 'friday':
                return 'bg-indigo-500/20 text-indigo-400';
            case 'saturday':
                return 'bg-pink-500/20 text-pink-400';
            case 'anytime':
                return 'bg-gray-600/20 text-gray-300';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    if (!mounted) return <StartLoader />;

    const sortedWorkArray = getSortedWorkArray();

    return (
        <div>
            <motion.div
                className="flex justify-center my-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
                    {["work", "deleted"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-4 max-sm:mx-2 my-2 max-w-3xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/10"
            >
                {/* <form onSubmit={handleAdd} className="flex gap-3 mb-6 justify-around">
                    <motion.input
                        whileFocus={{ scale: 1.02 }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder="Add a new work..."
                        className="w-[80%] bg-gray-800/70 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 rounded-xl px-4 py-2 transition-all duration-300"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!title.trim()}
                        className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${title.trim() ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                    >
                        Add
                    </motion.button>
                </form> */}

                <WorkForm CreateWork={CreateWork} />

                {/* Enhanced Heading with Sorting */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 bg-gray-800/70 border-b border-gray-700 sticky top-0 z-10`}
                >
                    <div onClick={()=> requestSort('clear')} className="cursor-pointer w-8 flex-shrink-0">
                        <div className="size-8 rounded-full flex items-center justify-center bg-gray-700/50 text-gray-400">
                            #
                        </div>
                    </div>

                    <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => requestSort('title')}
                    >
                        <div className="flex items-center gap-1">
                            <h3 className={`font-medium truncate text-white`}>
                                Title
                            </h3>
                            {sortConfig.key === 'title' && (
                                sortConfig.direction === 'asc' ?
                                    <ChevronUp className="size-4 text-purple-400" /> :
                                    <ChevronDown className="size-4 text-purple-400" />
                            )}
                        </div>
                    </div>

                    <div
                        className="max-sm:hidden block cursor-pointer"
                        onClick={() => requestSort('day')}
                    >
                        <div className="flex items-center gap-1">
                            <span className={`px-2 py-1 text-xs rounded-full bg-gray-700/50 text-gray-300`}>
                                Day
                            </span>
                            {sortConfig.key === 'day' && (
                                sortConfig.direction === 'asc' ?
                                    <ChevronUp className="size-4 text-purple-400" /> :
                                    <ChevronDown className="size-4 text-purple-400" />
                            )}
                        </div>
                    </div>
                    <div className="text-xs text-gray-300">
                        Edit
                    </div>

                    <div
                        className="w-8 flex-shrink-0 cursor-pointer flex items-center gap-1"
                        onClick={() => requestSort('completed')}
                    >
                        <span className="text-xs text-gray-300 sm:inline">Done</span>
                        {sortConfig.key === 'completed' && (
                            sortConfig.direction === 'asc' ?
                                <ChevronUp className="size-4 text-purple-400" /> :
                                <ChevronDown className="size-4 text-purple-400" />
                        )}
                    </div>
                </motion.div>

                {isLoading && <WorkLoader />}

                <div className="space-y-3">
                    <AnimatePresence>
                        {sortedWorkArray.map((work) => {
                            const dayDisplay = getDayDisplay(work.whenDoWork);
                            const dayColor = getDayColor(work.whenDoWork, dayDisplay.isToday, dayDisplay.isTomorrow);

                            if (work.isDeleted && activeTab === 'deleted') {
                                return (
                                    <motion.div
                                        key={work._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        whileHover={{ scale: 1.02 }}
                                        className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${work.completed
                                            ? 'bg-green-900/20 border-l-4 border-green-500'
                                            : 'bg-gray-800/50 border-l-4 border-purple-500'
                                            }`}
                                    >
                                        <div className="cursor-pointer" onClick={() => setShowDetailDialog(work)}>
                                            {work.imgUrl ? (
                                                <img
                                                    src={work.imgUrl}
                                                    alt="work"
                                                    className="size-8 object-cover rounded-full border-2 border-purple-500"
                                                />
                                            ) : (
                                                <div className="size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
                                                    <Info className="size-5 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-medium truncate ${work.completed ? 'line-through text-gray-400' : 'text-white'
                                                }`}>
                                                {work.title}
                                            </h3>
                                        </div>

                                        <div className="max-sm:hidden block">
                                            <span className={`px-2 py-1 text-xs rounded-full ${dayColor}`}>
                                                {dayDisplay.text}
                                            </span>
                                        </div>

                                        <div className="block sm:hidden">
                                            <span className={`px-2 py-1 text-xs rounded-full ${dayColor}`}>
                                                {dayDisplay.shortText}
                                            </span>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setShowUpdateDialog(work)}
                                            className="text-gray-300 hover:text-white cursor-pointer"
                                        >
                                            <Edit size={18} />
                                        </motion.button>

                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <input
                                                type="checkbox"
                                                checked={work.completed}
                                                onChange={() => handleToggleCompletion(work._id)}
                                                className="w-5 h-5 cursor-pointer accent-green-500 bg-gray-700 border-gray-600 rounded focus:ring-0"
                                            />
                                        </motion.div>
                                    </motion.div>
                                );
                            } else if (!work.isDeleted && activeTab === 'work') {
                                return (
                                    <motion.div
                                        key={work._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        whileHover={{ scale: 1.02 }}
                                        className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${work.completed
                                            ? 'bg-green-900/20 border-l-4 border-green-500'
                                            : 'bg-gray-800/50 border-l-4 border-purple-500'
                                            }`}
                                    >
                                        <div className="cursor-pointer" onClick={() => setShowDetailDialog(work)}>
                                            {work.imgUrl ? (
                                                <img
                                                    src={work.imgUrl}
                                                    alt="work"
                                                    className="size-8 object-cover rounded-full border-2 border-purple-500"
                                                />
                                            ) : (
                                                <div className="size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
                                                    <Info className="size-5 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-medium truncate ${work.completed ? 'line-through text-gray-400' : 'text-white'
                                                }`}>
                                                {work.title}
                                            </h3>
                                        </div>

                                        <div className="max-sm:hidden block">
                                            <span className={`px-2 py-1 text-xs rounded-full ${dayColor}`}>
                                                {dayDisplay.text}
                                            </span>
                                        </div>

                                        <div className="block sm:hidden">
                                            <span className={`px-2 py-1 text-xs rounded-full ${dayColor}`}>
                                                {dayDisplay.shortText}
                                            </span>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setShowUpdateDialog(work)}
                                            className="text-gray-300 hover:text-white cursor-pointer"
                                        >
                                            <Edit size={18} />
                                        </motion.button>

                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <input
                                                type="checkbox"
                                                checked={work.completed}
                                                onChange={() => handleToggleCompletion(work._id)}
                                                className="w-5 h-5 cursor-pointer accent-green-500 bg-gray-700 border-gray-600 rounded focus:ring-0"
                                            />
                                        </motion.div>
                                    </motion.div>
                                );
                            }
                            return null;
                        })}
                    </AnimatePresence>
                </div>
            </motion.div>
            {showUpdateDialog && <UpdateTaskWorkFormDialog showData={showUpdateDialog} setShowData={setShowUpdateDialog} />}
            {showDetailDialog && <DetailAndDeleteTaskWork showData={showDetailDialog} setShowData={setShowDetailDialog} />}
        </div>
    );
};

const WorkForm = ({CreateWork }) => {
    const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState("anytime");
    const [title, setTitle] = useState('');
    const days = [
      "anytime",
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];
  
    const handleSubmit = async(e) => {      
        e.preventDefault();
        if (!title.trim()) return;
        const res = await CreateWork({ title, whenDoWork: selectedDay?selectedDay:'anytime' });
        if (res.data) {
            setTitle('');
        }
    };
  
    const getDayDisplay = (day) => {
      if (day === "anytime") return "Anytime";
      return day.charAt(0).toUpperCase() + day.slice(1);
    };
  
    const getDayColor = (day) => {
      switch (day.toLowerCase()) {
        case 'sunday': return 'bg-red-500/20 text-red-400';
        case 'monday': return 'bg-blue-500/20 text-blue-400';
        case 'tuesday': return 'bg-purple-500/20 text-purple-400';
        case 'wednesday': return 'bg-green-500/20 text-green-400';
        case 'thursday': return 'bg-yellow-500/20 text-yellow-400';
        case 'friday': return 'bg-indigo-500/20 text-indigo-400';
        case 'saturday': return 'bg-pink-500/20 text-pink-400';
        default: return 'bg-gray-600/20 text-gray-300';
      }
    };
  
    return (
      <motion.form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex gap-3 w-full">
          {/* Text Input */}
          <motion.div 
            className="relative flex-1"
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <motion.input
              whileFocus={{ 
                boxShadow: "0 0 0 2px rgba(168, 85, 247, 0.5)",
                backgroundColor: "rgba(17, 24, 39, 0.8)"
              }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="What needs to be done?"
              className="w-full bg-gray-800/70 text-white placeholder-gray-400 outline-none rounded-xl px-4 py-3 pr-10 transition-all duration-300 border border-gray-700 focus:border-purple-500"
            />
            <motion.div 
              className="absolute right-3 top-1/2 -translate-y-1/2"
              animate={{ 
                opacity: title ? 1 : 0.5,
                scale: title ? 1.1 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="size-5 text-purple-400" />
            </motion.div>
          </motion.div>
  
          {/* Day Dropdown */}
          <motion.div 
            className="relative z-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="button"
              onClick={() => setIsDayDropdownOpen(!isDayDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${isDayDropdownOpen ? 'border-purple-500 bg-gray-800' : 'border-gray-700 bg-gray-800/70 hover:bg-gray-800'}`}
            >
              <span className={`text-sm font-medium ${getDayColor(selectedDay)} px-2 py-1 rounded-full`}>
                {getDayDisplay(selectedDay)}
              </span>
              <motion.div
                animate={{ rotate: isDayDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="size-4 text-gray-400" />
              </motion.div>
            </button>
  
            <AnimatePresence>
              {isDayDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden"
                >
                  {days.map((day) => (
                    <motion.button
                      key={day}
                      type="button"
                      whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedDay(day);
                        setIsDayDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${selectedDay === day ? 'bg-gray-700' : ''}`}
                    >
                      <span className={`${getDayColor(day)} px-2 py-1 rounded-full text-xs`}>
                        {getDayDisplay(day)}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
  
        {/* Submit Button */}
        <motion.button
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 5px 15px rgba(124, 58, 237, 0.3)"
          }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!title.trim()}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${title.trim() 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50' 
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
        >
          <motion.span
            animate={{ 
              x: title.trim() ? 0 : -5,
              opacity: title.trim() ? 1 : 0.7
            }}
          >
            Add Task
          </motion.span>
          <motion.div
            animate={{ 
              scale: title.trim() ? 1.2 : 1,
              rotate: title.trim() ? 0 : 45
            }}
          >
            <Plus className="size-5" />
          </motion.div>
        </motion.button>
      </motion.form>
    );
  };

const StartLoader = () => (
    <div className="p-4 my-2 max-w-3xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/10">
        <div className="flex gap-3 mb-6 justify-around">
            <div className="w-[80%] bg-gray-800/70 rounded-xl px-4 py-2 h-10 animate-pulse"></div>
            <div className="px-6 py-2 bg-gray-700 rounded-xl h-10 w-20 animate-pulse"></div>
        </div>
        <WorkLoader />
        <WorkLoader />
        <WorkLoader />
        <WorkLoader />
        <WorkLoader />
    </div>
);

const WorkLoader = () => (
    <div className="flex my-3 items-center space-x-4 px-4 py-3 bg-gray-800/50 rounded-xl border-l-4 border-gray-700">
        <div className="size-8 rounded-full bg-gray-700 animate-pulse"></div>
        <div className="flex-1">
            <div className="h-5 bg-gray-700 rounded animate-pulse w-3/4"></div>
        </div>
        <div className="hidden sm:block">
            <div className="h-5 bg-gray-700 rounded animate-pulse w-20"></div>
        </div>
        <div className="block sm:hidden">
            <div className="h-5 bg-gray-700 rounded animate-pulse w-8"></div>
        </div>
        <div className="size-5 bg-gray-700 rounded animate-pulse"></div>
        <div className="size-5 bg-gray-700 rounded animate-pulse"></div>
    </div>
);

export default Page;