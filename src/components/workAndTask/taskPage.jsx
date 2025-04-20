"use client";
import { Edit, Info, ChevronDown, ChevronUp, ExternalLink, Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UpdateTaskWorkFormDialog from "../dialog/updateTaskWork";
import { motion, AnimatePresence } from "framer-motion";
import DetailAndDeleteTaskWork from "../dialog/detailDeleteTaskWorkDialog";
import { useRouter } from "next/navigation";
import { useAddTaskMutation, useGetTaskQuery, useToggleCompleteTaskMutation } from "@/redux/api/task";
import { formatDateDisplay } from "@/utils/dateFormats";

export const TaskPage = () => {
    const [taskArray, setTaskArray] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState({});
    const [showDetailDialog, setShowDetailDialog] = useState({});
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();

    const [ToggleCompleteTask] = useToggleCompleteTaskMutation();
    const [CreateTask, { isLoading }] = useAddTaskMutation();
    const { data } = useGetTaskQuery();

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

    const handleShowMore = () => {
        setExpanded(!expanded);
    };

    const handleShowAll = () => {
        router.push('/tasks');
    };



    if (!mounted) return <StartLoader />;

    return (
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
                    placeholder="Add a new task..."
                    className="w-[80%] bg-gray-800/70 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 rounded-xl px-4 py-2 transition-all duration-300"
                />
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Calendar className="text-gray-500 size-5" />
                        </div>
                        <input
                            type="date"
                            className="w-full bg-gray-800/70 text-white mt-1 rounded-lg pl-10 pr-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            // value={date}
                            // onChange={handleDateChange}
                            min={() => {
                                const today = new Date();
                                return today.toISOString().split('T')[0];
                              }}
                        />
                    </div>
                </motion.div>
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

            <TaskForm CreateTask={CreateTask} />

            {isLoading && <TaskLoader />}

            <div className="space-y-3">
                <AnimatePresence>
                    {(expanded ? taskArray : taskArray?.slice(0, 5)).map((task) => {
                        const dateDisplay = formatDateDisplay(task.doTaskOn);

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
                    })}
                </AnimatePresence>
            </div>

            {taskArray?.length > 5 && (
                <div className="flex justify-center gap-4 mt-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShowMore}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 text-gray-300 hover:text-white border border-gray-700 transition-all"
                    >
                        {expanded ? (
                            <>
                                <ChevronUp className="size-5" />
                                Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="size-5" />
                                Show More ({taskArray.length - 5})
                            </>
                        )}
                    </motion.button>

                    {expanded && (
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleShowAll}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 hover:text-white border border-purple-500/30 transition-all"
                        >
                            <ExternalLink className="size-5" />
                            Show All
                        </motion.button>
                    )}
                </div>
            )}

            {showUpdateDialog && <UpdateTaskWorkFormDialog showData={showUpdateDialog} setShowData={setShowUpdateDialog} />}
            {showDetailDialog && <DetailAndDeleteTaskWork showData={showDetailDialog} setShowData={setShowDetailDialog} />}
        </motion.div>
    );
};

const TaskForm = ({ CreateTask }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [title, setTitle] = useState('');
    const datePickerRef = useRef(null);

    // Set default date to tomorrow
    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDate(tomorrow.toISOString().split("T")[0]);
    }, []);

    // Close date picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setShowDatePicker(false);
    };

    const handleCalendarClick = () => {
        setShowDatePicker(!showDatePicker);
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return "Select date";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        const res = await CreateTask({ title, doTaskOn: selectedDate });
        if (res.data) {
            setTitle('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6 justify-around">
            <motion.input
                whileFocus={{ scale: 1.02 }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Add a new task..."
                className="w-[70%] bg-gray-800/70 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 rounded-xl px-4 py-2 transition-all duration-300"
            />

            <div className="relative w-[20%]" ref={datePickerRef}>
                <motion.button
                    type="button"
                    onClick={handleCalendarClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-full h-full bg-gray-800/70 hover:bg-gray-700/50 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                    <div className="flex items-center gap-2 px-3 py-2">
                        <Calendar className="text-purple-400 size-5" />
                        <span className="text-white text-sm">
                            {formatDisplayDate(selectedDate)}
                        </span>
                    </div>
                </motion.button>

                <AnimatePresence>
                    {showDatePicker && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-10 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
                        >
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full p-2 bg-gray-800 text-white focus:outline-none"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!title.trim()}
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    title.trim()
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
            >
                Add
            </motion.button>
        </form>
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


