"use client";
import { useAddWorkMutation, useGetWorkQuery, useToggleCompleteWorkMutation } from "@/redux/api/work";
import { Edit, Info, ChevronDown, ChevronUp, ExternalLink, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UpdateTaskWorkFormDialog from "../dialog/updateTaskWork";
import { motion, AnimatePresence } from "framer-motion";
import DetailAndDeleteTaskWork from "../dialog/detailDeleteTaskWorkDialog";
import { useRouter } from "next/navigation";
import { getDayDisplay } from "@/utils/dateFormats";

export const WorkPage = () => {
    const [workArray, setWorkArray] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState({});
    const [showDetailDialog, setShowDetailDialog] = useState({});
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();

    const { workData } = useSelector((state) => state.work);
    const [CreateWork, { isLoading }] = useAddWorkMutation();
    const [ToggleCompleteWork] = useToggleCompleteWorkMutation();
    const { data ,isError,error} = useGetWorkQuery();

    console.log(isError,error);
    

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



    const handleShowMore = () => {
        setExpanded(!expanded);
    };

    const handleShowAll = () => {
        router.push('/works');
    };

    if (!mounted) return <StartLoader />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 max-sm:mx-2 my-2 max-w-3xl mx-auto bg-gradient-to-br from-gray-900/20 to-gray-800/20 border-2 border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/10"
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

            <WorkForm handleAdd={CreateWork} />

            {isLoading && <WorkLoader />}

            <div className="space-y-3">
                <AnimatePresence>
                    {(expanded ? workArray : workArray?.slice(0, 5)).map((work) => {
                        const dayDisplay = getDayDisplay(work.whenDoWork);
                        const dayColor = getDayColor(work.whenDoWork, dayDisplay.isToday, dayDisplay.isTomorrow);

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
                    })}
                </AnimatePresence>
            </div>

            {workArray?.length > 5 && (
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
                                Show More ({workArray.length - 5})
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

const WorkForm = ({ handleAdd }) => {
    const [isDayOpen, setIsDayOpen] = useState(false);
    const [title, setTitle] = useState("");
    const days = ["anytime","sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    const [selectedDay, setSelectedDay] = useState("anytime");
  
    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        const res = await handleAdd({ title, whenDoWork:selectedDay? selectedDay: 'anytime' });
        if (res.data) {
            setTitle('');
        }
    };
  
    const getDayDisplay = (day) => {
      if (day === "anytime") return <span className="max-sm:hidden">Anytime</span>;
      return day === "anytime" ? "Any" : day.slice(0,3);
    };
  
    const getDayColor = (day) => {
      const colors = {
        sunday: 'bg-red-500/20 text-red-400',
        monday: 'bg-blue-500/20 text-blue-400',
        tuesday: 'bg-purple-500/20 text-purple-400',
        wednesday: 'bg-green-500/20 text-green-400',
        thursday: 'bg-yellow-500/20 text-yellow-400',
        friday: 'bg-indigo-500/20 text-indigo-400',
        saturday: 'bg-pink-500/20 text-pink-400',
        anytime: 'bg-gray-600/20 text-gray-300'
      };
      return colors[day] || colors.anytime;
    };
  
    return (
      <motion.form 
        onSubmit={handleSubmit}
        className="flex gap-2 w-full items-stretch mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Text Input */}
        <motion.div 
          className="relative flex-1"
          whileFocus={{ scale: 1.01 }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Add task..."
            className="w-full bg-gray-800/70 text-white placeholder-gray-400 outline-none rounded-lg px-4 py-2 transition-all duration-200 border border-gray-700 focus:border-purple-500"
          />
          <AnimatePresence>
            {title && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Plus className="size-4 text-purple-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
  
        {/* Day Selector */}
        <div className="relative">
          <motion.button
            type="button"
            onClick={() => setIsDayOpen(!isDayOpen)}
            whileTap={{ scale: 0.95 }}
            className={`h-full px-3 py-2 rounded-lg border flex items-center ${getDayColor(selectedDay)} border-transparent`}
          >
            <span className="text-xs">{getDayDisplay(selectedDay)}</span>
            <motion.div
              animate={{ rotate: isDayOpen ? 180 : 0 }}
              className="ml-1"
            >
              <ChevronDown className="size-3" />
            </motion.div>
          </motion.button>
  
          <AnimatePresence>
            {isDayOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 right-0 mt-1 w-28 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
              >
                {days.map(day => (
                  <motion.button
                    key={day}
                    type="button"
                    whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                    onClick={() => {
                      setSelectedDay(day);
                      setIsDayOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center ${getDayColor(day)} ${selectedDay === day ? 'ring-1 ring-purple-400' : ''}`}
                  >
                    {day === "anytime" ? "Anytime" : day.slice(0,3)}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
  
        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!title.trim()}
          whileHover={{ scale: title.trim() ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${title.trim() 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
        >
          <Plus className="size-4" />
        </motion.button>
      </motion.form>
    );
  };

// ... (keep the existing getDayColor, StartLoader, and WorkLoader components)
const getDayColor = (day, isToday = false, isTomorrow = false) => {
    const dayLower = day.toLowerCase();

    // Priority for Today/Tomorrow
    if (isToday) return 'bg-red-500/30 text-red-400 font-bold animate-pulse';
    if (isTomorrow) return 'bg-orange-500/30 text-orange-400 font-semibold';

    // Specific day colors
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