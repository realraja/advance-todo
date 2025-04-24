'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Sparkles, Award } from 'lucide-react';
import classNames from 'classnames';
import toast from 'react-hot-toast';
import { useAddImportantEventMutation } from '@/redux/api/user';

export default function AddEventDialog({
    show,
    setShow
}) {
    const cancelRef = useRef(null);
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [addEvent] = useAddImportantEventMutation();

    const handleDateChange = (e) => {
        setEventDate(e.target.value);
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const handleSubmit = async () => {
        if (!eventName.trim() || !eventDate) return;
        
        setIsSubmitting(true);
        
        try {
            const toastId = toast.loading('Adding Event...');
            const data = await addEvent({
                name: eventName,
                date: eventDate
            });

            if(data.data?.success){
                toast.success('Event added successfully!', {id: toastId});
                setShow(false);
                setEventName('');
                setEventDate('');
            } else {
                toast.error(data.error?.data?.message || 'Failed to add event', {id: toastId});
            }
        } catch (error) {
            console.error('Error adding event:', error);
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" initialFocus={cancelRef} onClose={() => setShow(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <motion.div
                        className="fixed inset-0 bg-gradient-to-br from-black/90 to-purple-900/20 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-90"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-90"
                    >
                        <Dialog.Panel
                            as={motion.div}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl shadow-purple-500/10 border border-gray-700/50 flex flex-col"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <Award className="text-purple-400" size={20} />
                                        <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            Add New Event
                                        </Dialog.Title>
                                    </div>
                                    <motion.button
                                        whileHover={{ rotate: 90, scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShow(false)}
                                        className="p-1 rounded-full hover:bg-gray-800/50 transition"
                                    >
                                        <X className="text-gray-400 hover:text-white transition size-5" />
                                    </motion.button>
                                </div>

                                <div className="space-y-4">
                                    {/* Event Name Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Event Name*</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full mt-1 bg-gray-800/70 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500"
                                                value={eventName}
                                                onChange={(e) => setEventName(e.target.value)}
                                                placeholder="Enter event name"
                                            />
                                            {!eventName.trim() && (
                                                <motion.span
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-400"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    Required
                                                </motion.span>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Event Date */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Event Date*</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <Calendar className="text-purple-500 size-5" />
                                            </div>
                                            <input
                                                type="date"
                                                className="w-full bg-gray-800/70 text-white mt-1 rounded-lg pl-10 pr-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                value={eventDate}
                                                onChange={handleDateChange}
                                                min={getMinDate()}
                                            />
                                            {!eventDate && (
                                                <motion.span
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-400"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    Required
                                                </motion.span>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Footer with Action Buttons */}
                            <div className="p-6 pt-0">
                                <div className="mt-6 flex justify-end space-x-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="rounded-lg bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700/50 border border-gray-700 transition"
                                        onClick={() => setShow(false)}
                                        ref={cancelRef}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={!eventName.trim() || !eventDate || isSubmitting}
                                        className={classNames(
                                            "rounded-lg px-4 py-2 text-sm font-semibold transition flex items-center gap-1",
                                            eventName.trim() && eventDate
                                                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
                                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                        )}
                                        onClick={handleSubmit}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={16} />
                                                Add Event
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}