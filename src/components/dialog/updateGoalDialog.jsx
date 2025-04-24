'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import classNames from 'classnames';
import { useAsyncMutation } from '@/hook/mutationHook';
import { useUpdateMutation } from '@/redux/api/goal';

export default function UpdateGoalFormDialog({
    showData,
  setShowData,
    type = 'weekly',
}) {
    const cancelRef = useRef(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    const [UpdateGoal] = useAsyncMutation(useUpdateMutation);

      useEffect(() => {
        setTitle(showData?.title || '');
        setDescription(showData?.description || '');
        setImagePreview(showData?.imgUrl || null);
        setDate(showData?.doBefore?.split('T')[0] || '');
    

      }, [showData]);

    useEffect(() => {
        const today = new Date();
        const tomorrow = getNextValidDate(today, type);
        const formattedDate = tomorrow.toISOString().split('T')[0];
        setDate(formattedDate);
    }, [type]);

    const getNextValidDate = (fromDate, goalType) => {
        const date = new Date(fromDate);
        date.setDate(date.getDate() + 1); // Start from tomorrow by default
        
        if (goalType === 'weekly') {
            // Find next Sunday
            while (date.getDay() !== 0) {
                date.setDate(date.getDate() + 1);
            }
        } else if (goalType === 'monthly') {
            // Set to 1st of next month
            date.setDate(1);
            if (date <= fromDate) {
                date.setMonth(date.getMonth() + 1);
            }
        } else if (goalType === 'yearly') {
            // Set to next Jan 1st or May 18th
            const currentYear = date.getFullYear();
            const jan1 = new Date(currentYear, 0, 1);
            const may18 = new Date(currentYear, 4, 18);
            
            if (date <= jan1) {
                return jan1;
            } else if (date <= may18) {
                return may18;
            } else {
                return new Date(currentYear + 1, 0, 1);
            }
        }
        
        return date;
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) return;
        if (!description.trim()) return;

        setShowData({});
        await UpdateGoal('Creating Work...', {
            id:showData._id,
            type,
            title,
            description,
            doBefore: date,
            image: imagePreview
        });
    };

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate >= today) {
            // Adjust the date based on the type
            let adjustedDate = selectedDate;
            
            if (type === 'weekly') {
                // Set to Sunday of selected week
                adjustedDate.setDate(selectedDate.getDate() + (7 - selectedDate.getDay()) % 7);
            } else if (type === 'monthly') {
                // Set to 1st of the month
                adjustedDate.setDate(1);
            } else if (type === 'yearly') {
                // Set to Jan 1st or May 18th of the year
                const year = selectedDate.getFullYear();
                const jan1 = new Date(year, 0, 1);
                const may18 = new Date(year, 4, 18);
                
                adjustedDate = selectedDate >= may18 ? 
                    new Date(year + 1, 0, 1) : 
                    (selectedDate >= jan1 ? may18 : jan1);
            }
            
            setDate(adjustedDate.toISOString().split('T')[0]);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getDateOptions = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const options = [];
        
        if (type === 'weekly') {
            // Show next 4 Sundays
            for (let i = 0; i < 4; i++) {
                const date = new Date();
                // Find next Sunday
                date.setDate(date.getDate() + (7 - date.getDay()) % 7 + (i * 7));
                options.push(date);
            }
        } else if (type === 'monthly') {
            // Show next 6 months' 1st
            for (let i = 0; i < 6; i++) {
                const date = new Date();
                date.setMonth(date.getMonth() + i);
                date.setDate(1);
                options.push(date);
            }
        } else if (type === 'yearly') {
            // Show Jan 1 and May 18 for next 3 years
            for (let i = 0; i < 3; i++) {
                const year = today.getFullYear() + i;
                options.push(new Date(year, 0, 1));
                options.push(new Date(year, 4, 18));
            }
        }
        
        return options.filter(d => d >= today);
    };

    const formatDateDisplay = (dateStr) => {
        const date = new Date(dateStr);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <Transition.Root show={Object.keys(showData ?? {}).length !== 0} as={Fragment}>
            <Dialog as="div" className="relative z-50" initialFocus={cancelRef} onClose={() => setShowData({})}>
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
                            className="w-full max-w-md rounded-2xl bg-gradient-to-br  overflow-auto scrollEditclass from-gray-900 to-gray-800 shadow-xl shadow-purple-500/10 border border-gray-700/50 flex flex-col"
                            style={{ maxHeight: '90vh' }}
                            
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        Edit {type.charAt(0).toUpperCase() + type.slice(1)} Goal
                                    </Dialog.Title>
                                    <motion.button
                                        whileHover={{ rotate: 90, scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowData({})}
                                        className="p-1 rounded-full hover:bg-gray-800/50 transition"
                                    >
                                        <X className="text-gray-400 hover:text-white transition size-5" />
                                    </motion.button>
                                </div>

                                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Title*</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full mt-1 bg-gray-800/70 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder={`Enter ${type} title`}
                                            />
                                            {!title.trim() && (
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

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Description*</label>
                                        <div className="relative">
                                            <textarea
                                                className="w-full mt-1 bg-gray-800/70 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500 min-h-[100px]"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder={`Describe your ${type} goal...`}
                                            />
                                            {!description.trim() && (
                                                <motion.span
                                                    className="absolute right-3 top-3 text-xs text-red-400"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    Required
                                                </motion.span>
                                            )}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Image</label>
                                        <AnimatePresence mode="wait">
                                            {imagePreview ? (
                                                <motion.div
                                                    key="preview"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="relative group"
                                                >
                                                    <div className="overflow-hidden items-center rounded-lg border-2 border-dashed border-gray-700/50">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-52 m-auto object-cover"
                                                        />
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="absolute top-2 right-2 p-1.5 bg-gray-900/80 rounded-full hover:bg-red-500/80 transition shadow-lg"
                                                    >
                                                        <X className="text-white size-4" />
                                                    </motion.button>
                                                </motion.div>
                                            ) : (
                                                <motion.label
                                                    key="upload"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex flex-col items-center justify-center px-4 py-8 bg-gray-800/50 border-2 border-dashed border-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700/30 transition group h-52"
                                                    whileHover={{ scale: 1.01 }}
                                                >
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                        accept="image/*"
                                                    />
                                                    <div className="text-center space-y-2">
                                                        <motion.div
                                                            whileHover={{ scale: 1.1 }}
                                                            className="p-3 flex justify-center items-center bg-gray-700/50 rounded-full group-hover:bg-purple-500/20 transition mx-auto"
                                                        >
                                                            <Upload className="text-gray-400 group-hover:text-purple-400 transition size-6" />
                                                        </motion.div>
                                                        <p className="text-gray-400 group-hover:text-gray-300 transition text-sm">
                                                            Click to upload image
                                                        </p>
                                                        <p className="text-xs text-gray-500 group-hover:text-gray-400 transition">
                                                            PNG, JPG, GIF (max 5MB)
                                                        </p>
                                                    </div>
                                                </motion.label>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="relative"
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Due Date*</label>
                                        
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <Calendar className="text-gray-500 size-5" />
                                            </div>
                                            <input
                                                type="date"
                                                className="w-full bg-gray-800/70 text-white mt-1 rounded-lg pl-10 pr-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                value={date}
                                                onChange={handleDateChange}
                                                min={getMinDate()}
                                            />
                                            <motion.button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={() => setDatePickerOpen(!datePickerOpen)}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {datePickerOpen ? (
                                                    <ChevronUp className="text-gray-400 size-5" />
                                                ) : (
                                                    <ChevronDown className="text-gray-400 size-5" />
                                                )}
                                            </motion.button>
                                        </div>
                                        
                                        <AnimatePresence>
                                            {datePickerOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-2 bg-gray-800/70 rounded-lg p-2 border border-gray-700 max-h-48 overflow-y-auto">
                                                        {getDateOptions().map((option, idx) => (
                                                            <motion.button
                                                                key={idx}
                                                                type="button"
                                                                className={`w-full text-left p-2 rounded-md text-sm ${date === option.toISOString().split('T')[0] ? 'bg-purple-600/30 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
                                                                onClick={() => {
                                                                    setDate(option.toISOString().split('T')[0]);
                                                                    setDatePickerOpen(false);
                                                                }}
                                                                whileHover={{ scale: 1.01 }}
                                                            >
                                                                {formatDateDisplay(option)}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        
                                        <div className="mt-1 text-xs text-purple-400">
                                            {type === 'weekly' && 'Will automatically select Sundays'}
                                            {type === 'monthly' && 'Will automatically select 1st of the month'}
                                            {type === 'yearly' && 'Will automatically select Jan 1st or May 18th'}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="p-6 pt-0">
                                <div className="mt-6 flex justify-end space-x-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="rounded-lg bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700/50 border border-gray-700 transition"
                                        onClick={() => setShowData({})}
                                        ref={cancelRef}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={!title.trim() || !description.trim()}
                                        className={classNames(
                                            "rounded-lg px-4 py-2 text-sm font-semibold transition",
                                            title.trim() && description.trim()
                                                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
                                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                        )}
                                        onClick={handleSubmit}
                                    >
                                        {`Create ${type.charAt(0).toUpperCase() + type.slice(1)} Goal`}
                                        <motion.span 
                                            className="inline-block ml-1"
                                            whileHover={{ x: [0, 2, 0] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                        >
                                            ✨
                                        </motion.span>
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