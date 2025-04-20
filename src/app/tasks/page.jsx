"use client";
import { ChevronDown, ChevronUp, Edit, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAddTaskMutation, useGetAllTaskQuery, useToggleCompleteTaskMutation } from "@/redux/api/task";
import { formatDateDisplay } from "@/utils/dateFormats";
import UpdateTaskWorkFormDialog from "@/components/dialog/updateTaskWork";
import DetailAndDeleteTaskWork from "@/components/dialog/detailDeleteTaskWorkDialog";

const Page = () => {
    const [activeTab, setActiveTab] = useState("task");
    const [taskArray, setTaskArray] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState({});
    const [showDetailDialog, setShowDetailDialog] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const [ToggleCompleteTask] = useToggleCompleteTaskMutation();
    const [CreateTask, { isLoading }] = useAddTaskMutation();
    const { data } = useGetAllTaskQuery();

    console.log(data)

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setTaskArray(data?.data?.task || []);
    }, [data]);



    const handleToggleCompletion = async (id) => {
        setTaskArray((prev) => {
            return prev.map((task) => {
                if (task._id === id) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            })
        });
        await ToggleCompleteTask(id);
    };


    
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedWorkArray = () => {
        const sortableItems = [...taskArray];
        if (!sortConfig.key) return sortableItems;

        return sortableItems.sort((a, b) => {
            if (sortConfig.key === 'title') {
                const titleA = a.title.toLowerCase();
                const titleB = b.title.toLowerCase();
                if (titleA < titleB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (titleA > titleB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            }

            if (sortConfig.key === 'date') {
                const dateA = new Date(a.doTaskOn);
                const dateB = new Date(b.doTaskOn);
              
                return sortConfig.direction === 'asc'
                  ? dateA - dateB
                  : dateB - dateA;
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
    const sortedTaskArray = getSortedWorkArray();






    if (!mounted) return <StartLoader />;

    return (<div>

        <motion.div
            className="flex justify-center my-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
                {["task", "deleted"].map((tab) => (
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


            <TaskForm CreateTask={CreateTask} />

            {/* Enhanced Heading with Sorting */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 bg-gray-800/70 border-b border-gray-700 sticky top-0 z-10`}
            >
                <div onClick={() => requestSort('clear')} className="cursor-pointer w-8 flex-shrink-0">
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
                    onClick={() => requestSort('date')}
                >
                    <div className="flex items-center gap-1">
                        <span className={`px-2 py-1 text-xs rounded-full bg-gray-700/50 text-gray-300`}>
                            Date
                        </span>
                        {sortConfig.key === 'date' && (
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

            {isLoading && <TaskLoader />}

            <div className="space-y-3">
                <AnimatePresence>
                    {sortedTaskArray.map((task) => {
                        const dateDisplay = formatDateDisplay(task.doTaskOn);

                        if (activeTab === "deleted" && task.isDeleted) {
                            return (
                                <motion.div
                                    key={task._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${task.completed
                                        ? 'bg-green-900/20 border-l-4 border-green-500'
                                        : 'bg-gray-800/50 border-l-4 border-purple-500'
                                        }`}
                                >
                                    <div className="cursor-pointer" onClick={() => setShowDetailDialog(task)}>
                                        {task.imgUrl ? (
                                            <img
                                                src={task.imgUrl}
                                                alt="task"
                                                className="size-8 object-cover rounded-full border-2 border-purple-500"
                                            />
                                        ) : (
                                            <div className="size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
                                                <Info className="size-5 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-medium truncate ${task.completed ? 'line-through text-gray-400' : 'text-white'
                                            }`}>
                                            {task.title}
                                        </h3>
                                    </div>

                                    <div className="max-sm:hidden">
                                        <span className={`px-2 py-1 text-xs rounded-full ${dateDisplay.color}`}>
                                            {dateDisplay.text}
                                        </span>
                                    </div>

                                    <div className="sm:hidden">
                                        <span className={`px-2 py-1 text-xs rounded-full ${dateDisplay.color}`}>
                                            {dateDisplay.shortText}
                                        </span>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowUpdateDialog(task)}
                                        className="text-gray-300 hover:text-white cursor-pointer"
                                    >
                                        <Edit size={18} />
                                    </motion.button>

                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => handleToggleCompletion(task._id)}
                                            className="w-5 h-5 cursor-pointer accent-green-500 bg-gray-700 border-gray-600 rounded focus:ring-0"
                                        />
                                    </motion.div>
                                </motion.div>
                            );
                        } else if (!task.isDeleted && activeTab === "task") {
                            return (
                                <motion.div
                                    key={task._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${task.completed
                                        ? 'bg-green-900/20 border-l-4 border-green-500'
                                        : 'bg-gray-800/50 border-l-4 border-purple-500'
                                        }`}
                                >
                                    <div className="cursor-pointer" onClick={() => setShowDetailDialog(task)}>
                                        {task.imgUrl ? (
                                            <img
                                                src={task.imgUrl}
                                                alt="task"
                                                className="size-8 object-cover rounded-full border-2 border-purple-500"
                                            />
                                        ) : (
                                            <div className="size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
                                                <Info className="size-5 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-medium truncate ${task.completed ? 'line-through text-gray-400' : 'text-white'
                                            }`}>
                                            {task.title}
                                        </h3>
                                    </div>

                                    <div className="max-sm:hidden">
                                        <span className={`px-2 py-1 text-xs rounded-full ${dateDisplay.color}`}>
                                            {dateDisplay.text}
                                        </span>
                                    </div>

                                    <div className="sm:hidden">
                                        <span className={`px-2 py-1 text-xs rounded-full ${dateDisplay.color}`}>
                                            {dateDisplay.shortText}
                                        </span>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowUpdateDialog(task)}
                                        className="text-gray-300 hover:text-white cursor-pointer"
                                    >
                                        <Edit size={18} />
                                    </motion.button>

                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => handleToggleCompletion(task._id)}
                                            className="w-5 h-5 cursor-pointer accent-green-500 bg-gray-700 border-gray-600 rounded focus:ring-0"
                                        />
                                    </motion.div>
                                </motion.div>
                            );
                        };
                    })}
                </AnimatePresence>
            </div>


            {showUpdateDialog && <UpdateTaskWorkFormDialog showData={showUpdateDialog} setShowData={setShowUpdateDialog} />}
            {showDetailDialog && <DetailAndDeleteTaskWork showData={showDetailDialog} setShowData={setShowDetailDialog} />}
        </motion.div></div>
    );
};

export default Page;

const TaskForm = ({ CreateTask }) => {
    const [selectedDate, setSelectedDate] = useState("");
    const [title, setTitle] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Set default date to tomorrow
    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDate(tomorrow.toISOString().split("T")[0]);
    }, []);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        const res = await CreateTask({ title, doTaskOn: selectedDate });
        if (res.data) {
            setTitle('');
            // Add a little visual feedback when task is added
            setIsFocused(false);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="flex gap-3 mb-6 justify-around items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="relative w-[70%]"
                animate={{
                    scale: isFocused ? 1.02 : 1,
                    boxShadow: isFocused ? "0 10px 25px -5px rgba(124, 58, 237, 0.2)" : "none"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
                <motion.input
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    placeholder="What needs to be done?"
                    className="w-full bg-gray-800/80 backdrop-blur-sm text-white placeholder-gray-400 outline-none rounded-xl px-4 py-3 transition-all duration-300 border border-gray-700 focus:border-purple-500"
                />
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-b-xl"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            exit={{ scaleX: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>

            <motion.div
                className="relative w-[20%]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-2 bg-gray-800/80 backdrop-blur-sm text-white focus:outline-none rounded-lg border border-gray-700 focus:border-purple-500 transition-colors duration-300"
                />
            </motion.div>

            <motion.button
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0 5px 15px rgba(124, 58, 237, 0.4)"
                }}
                whileTap={{
                    scale: 0.95,
                    boxShadow: "0 2px 5px rgba(124, 58, 237, 0.2)"
                }}
                type="submit"
                disabled={!title.trim()}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${title.trim()
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
            >
                {title.trim() && (
                    <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0"
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                )}
                <span className="relative z-10 flex items-center justify-center">
                    <motion.span
                        animate={{
                            x: title.trim() ? [0, 2, 0] : 0,
                            transition: { repeat: Infinity, duration: 2 }
                        }}
                    >
                        Add
                    </motion.span>
                    {title.trim() && (
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                        </motion.svg>
                    )}
                </span>
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
        <TaskLoader />
        <TaskLoader />
        <TaskLoader />
        <TaskLoader />
        <TaskLoader />
    </div>
);

const TaskLoader = () => (
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


