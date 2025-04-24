"use client";
import { Edit, Info, ChevronDown, ChevronUp, ExternalLink, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import UpdateGoalFormDialog from "../dialog/updateGoalDialog";
import { motion, AnimatePresence } from "framer-motion";
import DetailAndDeleteTaskWork from "../dialog/detailDeleteGoal";
import { useRouter } from "next/navigation";
import AddGoalFormDialog from "../dialog/addGoalDialog";
import { useCompleteMutation, useGetAllQuery } from "@/redux/api/goal";
import dayjs from "dayjs";

export const GoalPage = ({ type, showDeleted = false,homePage=true }) => {
    const [goalArray, setGoalArray] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState({});
    const [showDetailDialog, setShowDetailDialog] = useState({});
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [expandedGoal, setExpandedGoal] = useState(null);
    const router = useRouter();

    const [ToggleComplete] = useCompleteMutation();
    const { data } = useGetAllQuery();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (data) {
            const filterData = data?.data?.goal.filter((i) => {
                return i.type === type;
            });

            const deletedFilter = !showDeleted? filterData.filter((i)=> !i.isDeleted):filterData
            // console.log(filterData);
            setGoalArray(deletedFilter || []);
        }
    }, [data]);

    const handleToggleCompletion = async (id) => {
        setGoalArray((prev) => {
            return prev.map((goal) => {
                if (goal._id === id) {
                    return { ...goal, completed: !goal.completed };
                }
                return goal;
            })
        });
        await ToggleComplete(id);
    };

    const handleShowMore = () => {
        setExpanded(!expanded);
    };

    const handleShowAll = () => {
        router.push('/goals');
    };

    const toggleExpandGoal = (id) => {
        setExpandedGoal(expandedGoal === id ? null : id);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Tomorrow";
        if (diffDays === -1) return "Yesterday";
        if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

        return dayjs(date).format("ddd, MMM D");
    };

    const getDateColor = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "text-red-400";
        if (diffDays < 3) return "text-yellow-400";
        return "text-green-400";
    };

    if (!mounted) return <StartLoader />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 max-sm:mx-2 my-2 max-w-3xl mx-auto bg-gradient-to-br from-gray-900/20 to-gray-800/20 border-2 border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/10"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Goals
                </h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <Plus className="size-5" />
                    Set Goal
                </motion.button>
            </div>

            <div className="space-y-3">
                <AnimatePresence>
                    {(expanded || !homePage ? goalArray : goalArray?.slice(0, 5)).map((goal) => {
                        if (goal.type !== type) return null;
                        if (goal.isDeleted && showDeleted) return (
                            <motion.div
                                key={goal._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className={`overflow-hidden rounded-xl transition-all duration-300 ${goal.completed
                                    ? 'bg-green-900/20 border-l-4 border-green-500'
                                    : 'bg-gray-800/50 border-l-4 border-purple-500'
                                    }`}
                            >
                                <div
                                    className="flex items-center space-x-4 px-4 py-3 cursor-pointer"
                                    onClick={() => toggleExpandGoal(goal._id)}
                                >
                                    <div className="cursor-pointer" onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDetailDialog(goal);
                                    }}>
                                        {goal.imgUrl ? (
                                            <img
                                                src={goal.imgUrl}
                                                alt="goal"
                                                className="size-8 object-cover rounded-full border-2 border-purple-500"
                                            />
                                        ) : (
                                            <div className="size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
                                                <Info className="size-5 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-medium truncate ${goal.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                                            {goal.title}
                                        </h3>
                                    </div>

                                    <div className={`text-sm font-medium ${getDateColor(goal.doBefore)}`}>
                                        {formatDate(goal.doBefore)}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowUpdateDialog(goal);
                                        }}
                                        className="text-gray-300 hover:text-white"
                                    >
                                        <Edit size={18} />
                                    </motion.button>

                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={goal.completed}
                                            onChange={() => handleToggleCompletion(goal._id)}
                                            className="w-5 h-5 cursor-pointer accent-green-500 bg-gray-700 border-gray-600 rounded focus:ring-0"
                                        />
                                    </motion.div>
                                </div>

                                <AnimatePresence>
                                    {expandedGoal === goal._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="px-4 pb-3"
                                        >
                                            <div className="pt-2 border-t border-gray-700/50">
                                                <p className="text-gray-300 text-sm">{goal.description || "No description provided"}</p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        Created: {dayjs(goal.createdAt).format("MMM D, YYYY")}
                                                    </span>
                                                    <span className={`text-xs ${getDateColor(goal.doBefore)}`}>
                                                        Due: {formatDate(goal.doBefore)}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );

                        if (!goal.isDeleted && !showDeleted) return (
                            <motion.div
                                key={goal._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className={`overflow-hidden rounded-xl transition-all duration-300 ${goal.completed
                                    ? 'bg-green-900/20 border-l-4 border-green-500'
                                    : 'bg-gray-800/50 border-l-4 border-purple-500'
                                    }`}
                            >
                                <div
                                    className="flex items-center space-x-4 px-4 py-3 cursor-pointer"
                                    onClick={() => toggleExpandGoal(goal._id)}
                                >
                                    <div className="cursor-pointer" onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDetailDialog(goal);
                                    }}>
                                        {goal.imgUrl ? (
                                            <img
                                                src={goal.imgUrl}
                                                alt="goal"
                                                className="size-8 object-cover rounded-full border-2 border-purple-500"
                                            />
                                        ) : (
                                            <div className="size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
                                                <Info className="size-5 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-medium truncate ${goal.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                                            {goal.title}
                                        </h3>
                                    </div>

                                    <div className={`text-sm font-medium ${getDateColor(goal.doBefore)}`}>
                                        {formatDate(goal.doBefore)}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowUpdateDialog(goal);
                                        }}
                                        className="text-gray-300 hover:text-white"
                                    >
                                        <Edit size={18} />
                                    </motion.button>

                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={goal.completed}
                                            onChange={() => handleToggleCompletion(goal._id)}
                                            className="w-5 h-5 cursor-pointer accent-green-500 bg-gray-700 border-gray-600 rounded focus:ring-0"
                                        />
                                    </motion.div>
                                </div>

                                <AnimatePresence>
                                    {expandedGoal === goal._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="px-4 pb-3"
                                        >
                                            <div className="pt-2 border-t border-gray-700/50">
                                                <p className="text-gray-300 text-sm">{goal.description || "No description provided"}</p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        Created: {dayjs(goal.createdAt).format("MMM D, YYYY")}
                                                    </span>
                                                    <span className={`text-xs ${getDateColor(goal.doBefore)}`}>
                                                        Due: {formatDate(goal.doBefore)}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {goalArray?.length > 5 && homePage && (
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
                                Show More ({goalArray.length - 5})
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

            {showAddDialog && <AddGoalFormDialog show={showAddDialog} setShow={setShowAddDialog} type={type} />}
            {showUpdateDialog && <UpdateGoalFormDialog type={type} showData={showUpdateDialog} setShowData={setShowUpdateDialog} />}
            {showDetailDialog && <DetailAndDeleteTaskWork showData={showDetailDialog} setShowData={setShowDetailDialog} />}
        </motion.div>
    );
};

const StartLoader = () => (
    <div className="p-4 my-2 max-w-3xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/10">
        <div className="flex gap-3 mb-6 justify-between items-center">
            <div className="w-32 h-8 bg-gray-800/70 rounded-xl animate-pulse"></div>
            <div className="w-24 h-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl animate-pulse"></div>
        </div>
        <GoalLoader />
        <GoalLoader />
        <GoalLoader />
        <GoalLoader />
        <GoalLoader />
    </div>
);

const GoalLoader = () => (
    <div className="flex my-3 items-center space-x-4 px-4 py-3 bg-gray-800/50 rounded-xl border-l-4 border-gray-700">
        <div className="size-8 rounded-full bg-gray-700 animate-pulse"></div>
        <div className="flex-1">
            <div className="h-5 bg-gray-700 rounded animate-pulse w-3/4"></div>
        </div>
        <div className="w-20 h-5 bg-gray-700 rounded animate-pulse"></div>
        <div className="size-5 bg-gray-700 rounded animate-pulse"></div>
        <div className="size-5 bg-gray-700 rounded animate-pulse"></div>
    </div>
);