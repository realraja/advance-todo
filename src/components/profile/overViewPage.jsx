"use client";
import { Activity, Award, CalendarArrowUp, CheckCircle, ChevronRight, Droplet, HeartPulse, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useAsyncMutation } from "@/hook/mutationHook";
import { useAddBathMutation, useAddBrushMutation, useAddDidThatMutation, useAddRunMutation, useGetUserDataQuery } from "@/redux/api/user";
import { useEffect, useState } from "react";
import AddEventDialog from "./addEventDialog";

const OverViewPage = () => {
    const [gridShowData, setGridShowData] = useState({});
    const [hoveredCard, setHoveredCard] = useState(null);
    const [showAddEventDialog, setShowAddEventDialog] = useState(false);

    const [AddBrushToday] = useAsyncMutation(useAddBrushMutation);
    const [AddBathToday] = useAsyncMutation(useAddBathMutation);
    const [AddRunningToday] = useAsyncMutation(useAddRunMutation);
    const [AddDidThatToday] = useAsyncMutation(useAddDidThatMutation);
    const {data} = useGetUserDataQuery();

    useEffect(() => {
        if(data){
            setGridShowData(data.data)
        }
    }, [data])

    const handleAddBrush = async() => {
        await AddBrushToday('Adding Brush...')
    }
    const handleAddBath = async() => {
        await AddBathToday('Adding Bath...')
    }
    const handleAddRunning = async() => {
        await AddRunningToday('Adding Running...')
    }
    const handleAddDidThat = async() => {
        await AddDidThatToday('Adding Activity...')
    }

    const cards = [
        {
            id: 'brush',
            name: 'Add Brush',
            Icon: Droplet,
            text: 'Have you brushed your teeth today?',
            btnText: 'Mark as Done',
            condition: !gridShowData?.isTodayBrushed,
            action: handleAddBrush,
            gradient: 'from-purple-500/20 to-indigo-500/20'
        },
        {
            id: 'bath',
            name: 'Add Bath',
            Icon: Activity,
            text: 'Have you taken a bath today?',
            btnText: 'Mark as Done',
            condition: !gridShowData?.isTodayBathed,
            action: handleAddBath,
            gradient: 'from-blue-500/20 to-cyan-500/20'
        },
        {
            id: 'running',
            name: 'Add Running',
            Icon: HeartPulse,
            text: 'Have you gone for a run today?',
            btnText: 'Mark as Done',
            condition: !gridShowData?.isTodayRunning,
            action: handleAddRunning,
            gradient: 'from-green-500/20 to-emerald-500/20'
        },
        {
            id: 'didThat',
            name: 'Add Activity',
            Icon: CheckCircle,
            text: 'Have you completed your daily activity?',
            btnText: 'Mark as Done',
            condition: !gridShowData?.isTodayDidThat,
            action: handleAddDidThat,
            gradient: 'from-yellow-500/20 to-amber-500/20'
        },
        {
            id: 'event',
            name: 'Add Event',
            Icon: Award,
            text: 'Add any special event you want to remember',
            btnText: 'Add New Event',
            condition: true,
            action: ()=> setShowAddEventDialog(true),
            gradient: 'from-pink-500/20 to-rose-500/20'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 flex justify-between items-center"
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Daily Activities
                    </h1>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-sm text-gray-400 flex items-center gap-1"
                    >
                        <Sparkles className="text-yellow-400" size={16} />
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </motion.div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {cards.filter(card => card.condition).map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                onHoverStart={() => setHoveredCard(card.id)}
                                onHoverEnd={() => setHoveredCard(null)}
                                className={`relative rounded-2xl p-1 bg-gradient-to-br ${card.gradient} overflow-hidden shadow-xl`}
                            >
                                <div className="bg-gray-900/80 backdrop-blur-sm h-full rounded-xl p-6 flex flex-col items-center">
                                    <motion.div
                                        animate={{
                                            scale: hoveredCard === card.id ? 1.1 : 1,
                                            rotate: hoveredCard === card.id ? 5 : 0
                                        }}
                                        transition={{ type: 'spring', stiffness: 500 }}
                                    >
                                        <card.Icon className={`size-16 mb-4 ${hoveredCard === card.id ? 'text-white' : 'text-purple-400'}`} />
                                    </motion.div>
                                    
                                    <h3 className="text-xl font-bold text-center text-white mb-2">
                                        {card.name}
                                    </h3>
                                    <p className="text-sm text-center text-gray-400 mb-6">
                                        {card.text}
                                    </p>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={card.action}
                                        className={`w-full px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                                            card.action 
                                                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg hover:shadow-purple-500/30'
                                                : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700/50'
                                        }`}
                                    >
                                        {card.btnText}
                                        {hoveredCard === card.id && (
                                            <motion.span
                                                initial={{ x: -5, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                <ChevronRight size={18} />
                                            </motion.span>
                                        )}
                                    </motion.button>

                                    <AnimatePresence>
                                        {hoveredCard === card.id && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-white pointer-events-none"
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Completed Activities */}
                {Object.values(gridShowData).filter(val => val === true).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12"
                    >
                        <h2 className="text-xl font-semibold text-gray-300 mb-4 flex items-center gap-2">
                            <CheckCircle className="text-green-400" size={20} />
                            Completed Today
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {gridShowData?.isTodayBrushed && (
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3"
                                >
                                    <Droplet className="text-green-400" size={20} />
                                    <span className="text-sm text-white">Brushed</span>
                                </motion.div>
                            )}
                            {gridShowData?.isTodayBathed && (
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3"
                                >
                                    <Activity className="text-green-400" size={20} />
                                    <span className="text-sm text-white">Bathed</span>
                                </motion.div>
                            )}
                            {gridShowData?.isTodayRunning && (
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3"
                                >
                                    <HeartPulse className="text-green-400" size={20} />
                                    <span className="text-sm text-white">Ran</span>
                                </motion.div>
                            )}
                            {gridShowData?.isTodayDidThat && (
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3"
                                >
                                    <CheckCircle className="text-green-400" size={20} />
                                    <span className="text-sm text-white">Activity</span>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </motion.div>

            <AddEventDialog setShow={setShowAddEventDialog} show={showAddEventDialog} />
        </div>
    );
}

export default OverViewPage;