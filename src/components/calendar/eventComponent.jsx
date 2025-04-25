"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sparkles, Cake, Gift, ChevronRight, Repeat, CalendarArrowUp, CalendarDays, Edit} from 'lucide-react';
import { useState, useEffect } from 'react';
import EditEventDialog from '../profile/editEventDialog';

export default function EventsComponent({ data, reFetch }) {
    const [events, setEvents] = useState([]);
    const [showEditEvent, setShowEditEvent] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [expandedEvent, setExpandedEvent] = useState(null);
    const [processedEvents, setProcessedEvents] = useState([]);


    useEffect(() => {
        if (data) {
            setEvents(data);
        }
    }, [data]);

    useEffect(() => {
        const processEvents = () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const processed = events.map(event => {
                const eventDate = new Date(event.date);
                let nextOccurrence = new Date(eventDate);

                const currentYear = today.getFullYear();
                nextOccurrence.setFullYear(currentYear);

                if (nextOccurrence < today) {
                    nextOccurrence.setFullYear(currentYear + 1);
                }

                const diffTime = nextOccurrence - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                return {
                    ...event,
                    nextOccurrence,
                    daysRemaining: diffDays,
                    displayDate: nextOccurrence,
                    yearsPassed: getTimeDifferenceFromToday(event.date).years
                };
            });

            processed.sort((a, b) => a.daysRemaining - b.daysRemaining);
            setProcessedEvents(processed);
        };

        processEvents();
    }, [events]);



    const handleEditEvent = (updatedEvent) => {
        setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
        setExpandedEvent(null);
        reFetch()
    };



    const toggleExpandEvent = (eventId) => {
        setExpandedEvent(expandedEvent === eventId ? null : eventId);
    };

    const getEventIcon = (eventName) => {
        if (eventName.toLowerCase().includes('birthday')) {
            return <Cake className="text-pink-400" size={20} />;
        }
        if (eventName.toLowerCase().includes('anniversary')) {
            return <Gift className="text-purple-400" size={20} />;
        }
        return <Sparkles className="text-yellow-400" size={20} />;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDaysText = (days) => {
        if (days === 0) return "Today!";
        if (days === 1) return "Tomorrow";
        if (days < 0) return `${Math.abs(days)} days ago`;
        return `${days} days left`;
    };

    const getDaysColor = (days) => {
        if (days <= 0) return 'bg-red-500/10 text-red-400';
        if (days <= 7) return 'bg-green-500/10 text-green-400';
        return 'bg-blue-500/10 text-blue-400';
    };

    function getTimeDifferenceFromToday(dateString) {
        const eventDate = new Date(dateString);
        const today = new Date();

        let years = today.getFullYear() - eventDate.getFullYear();
        const monthDiff = today.getMonth() - eventDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < eventDate.getDate())) {
            years--;
        }

        return { years };
    }

    return (
        <div className="p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3 sm:space-y-4"
                >
                    <AnimatePresence>
                        {processedEvents.map((event) => (
                            <div key={`${event._id}-${event.displayDate.getTime()}`}>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    whileHover={{ x: 5 }}
                                    className="group relative overflow-hidden rounded-lg sm:rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/30 transition-all cursor-pointer"
                                    onClick={() => toggleExpandEvent(event._id)}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>

                                    <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2 sm:gap-4">
                                            <div className="p-2 sm:p-3 bg-gray-700/50 rounded-lg group-hover:bg-purple-500/10 transition-all">
                                                {getEventIcon(event.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                                                        {event.name}
                                                    </h3>
                                                    <span className="hidden xs:inline-flex text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full items-center gap-1">
                                                        <Repeat size={12} /> Yearly
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400">
                                                    <Calendar size={12} className="flex-shrink-0" />
                                                    <span className="truncate">{formatDate(event.displayDate)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 sm:gap-4 ml-2">
                                            <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getDaysColor(event.daysRemaining)}`}>
                                                {getDaysText(event.daysRemaining)}
                                            </div>
                                            <motion.div
                                                animate={{ rotate: expandedEvent === event._id ? 90 : 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="hidden sm:block"
                                            >
                                                <ChevronRight className="text-gray-500 group-hover:text-purple-400 transition-all" size={20} />
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {expandedEvent === event._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-gray-800/30 rounded-b-lg sm:rounded-b-xl p-3 sm:p-4 border-t border-gray-700/50">
                                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarArrowUp className="text-purple-400 flex-shrink-0" size={16} />
                                                        <div>
                                                            <p className="text-xs text-gray-400">Original Date</p>
                                                            <p className="text-sm font-medium">{event.date.split('T')[0]}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays className="text-blue-400 flex-shrink-0" size={16} />
                                                        <div>
                                                            <p className="text-xs text-gray-400">Years Passed</p>
                                                            <p className="text-sm font-medium">{event.yearsPassed} Year{event.yearsPassed !== 1 ? 's' : ''}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedEvent(event);
                                                            setShowEditEvent(true);
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-xs sm:text-sm transition-all"
                                                    >
                                                        <Edit size={14} />
                                                        Edit
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </motion.div>



            {/* Edit Event Dialog */}
            {selectedEvent && (
                <EditEventDialog
                    show={showEditEvent}
                    setShow={setShowEditEvent}
                    event={selectedEvent}
                    onSuccess={handleEditEvent}
                />
            )}
        </div>
    );
}