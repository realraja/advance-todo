"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { GoalPage } from "@/components/goal/goal";
import { Info, Trophy, Calendar, Clock, TrendingUp, BarChart2, Check, Trash2 } from "lucide-react";

const Page = () => {
    const [activeTab, setActiveTab] = useState("goal");
    const [activeTab2, setActiveTab2] = useState("weekly");
    const [mute, setMute] = useState(false);

    // Animation variants for cleaner code
    const tabContentVariants = {
        initial: (direction) => ({
            opacity: 0,
            x: direction > 0 ? 50 : -50,
        }),
        animate: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: (direction) => ({
            opacity: 0,
            x: direction < 0 ? 50 : -50,
            transition: { duration: 0.2, ease: "easeIn" }
        })
    };

    // Determine animation direction based on tab order
    const tabs = ["weekly", "monthly", "yearly"];
    const getDirection = (newTab) => {
        const newIndex = tabs.indexOf(newTab);
        const oldIndex = tabs.indexOf(activeTab2);
        return newIndex > oldIndex ? 1 : -1;
    };
    
    useEffect(() => {
        setMute(true);
    }, []);

    if (!mute) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
            {/* Header Section */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8 text-center"
            >
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    My Goals Dashboard
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Track, manage, and achieve your weekly, monthly, and yearly goals in one place.
                    Visualize your progress and stay motivated!
                </p>
            </motion.header>

         

            {/* Main Content Tabs */}
            <motion.div
                className="flex justify-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
                    {["goal", "deleted"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === tab
                                    ? "text-white"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                {tab === "goal" ? <BarChart2 className="size-4" /> : <Trash2 className="size-4" />}
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Goal Type Navigation */}
            <motion.div
                className="flex justify-center my-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="relative flex space-x-1 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab2(tab)}
                            className={`relative px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                                activeTab2 === tab
                                    ? "text-white"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {activeTab2 === tab && (
                                <motion.div
                                    layoutId="activeTab2"
                                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Calendar className="size-4" />
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Info Box */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-800/30 rounded-xl p-4 border border-purple-500/20 mb-8"
            >
                <div className="flex items-start gap-3">
                    <Info className="text-purple-400 size-5 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="text-purple-300 font-medium mb-1">
                            {activeTab2 === "weekly" && "Weekly Goals Tip"}
                            {activeTab2 === "monthly" && "Monthly Goals Strategy"}
                            {activeTab2 === "yearly" && "Yearly Goals Advice"}
                        </h3>
                        <p className="text-gray-400 text-sm">
                            {activeTab2 === "weekly" && "Break your weekly goals into daily tasks for better manageability and tracking."}
                            {activeTab2 === "monthly" && "Review your monthly goals weekly to ensure you're on track with your progress."}
                            {activeTab2 === "yearly" && "Break down yearly goals into quarterly milestones for more achievable targets."}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Smooth Content Transition */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-12"
            >
                <AnimatePresence mode="wait" custom={getDirection(activeTab2)}>
                    <motion.div
                        key={activeTab2}
                        custom={getDirection(activeTab2)}
                        variants={tabContentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full"
                    >
                        <GoalPage type={activeTab2} showDeleted={activeTab === 'deleted'} homePage={false} />
                    </motion.div>
                </AnimatePresence>
            </motion.main>

            {/* Footer */}
            <motion.footer 
                className="mt-12 text-center text-gray-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <p>Track your progress and achieve more with our goal management system</p>
                <p className="mt-1">© {new Date().getFullYear()} Goals Dashboard</p>
            </motion.footer>
        </div>
    );
};

export default Page;