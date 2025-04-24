'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import classNames from 'classnames';
import { useAsyncMutation } from '@/hook/mutationHook';
import { useAddMutation, useUpdateLevelMutation } from '@/redux/api/skill';

export default function AddSkillFormDialog({
    show,
    setShow,
}) {
    const cancelRef = useRef(null);
    const [name, setName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [targetLevel, setTargetLevel] = useState('Intermediate');
    const [currentLevel, setCurrentLevel] = useState('notStarted');

    const targetLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
    const currentLevels = [
        "notStarted",
        "inProgress",
        "Started",
        "Beginner",
        "Improver",
        "Intermediate",
        "Advanced",
        "Expert",
    ];

    const [createSkill] = useAsyncMutation(useAddMutation);

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
        if (!name.trim()) return;

        setShow(false);
        await createSkill('Creating Skill...', {
            name,
            targetLevel,
            currentLevel,
            image: imagePreview
        });
    };

    const removeImage = () => {
        setImagePreview(null);
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

                <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto scrollEditclass">
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
                            className="w-full max-w-md rounded-2xl bg-gradient-to-br overflow-auto scrollEditclass from-gray-900 to-gray-800 shadow-xl shadow-purple-500/10 border border-gray-700/50 flex flex-col"
                            style={{ maxHeight: '90vh' }}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        Add New Skill
                                    </Dialog.Title>
                                    <motion.button
                                        whileHover={{ rotate: 90, scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShow(false)}
                                        className="p-1 rounded-full hover:bg-gray-800/50 transition"
                                    >
                                        <X className="text-gray-400 hover:text-white transition size-5" />
                                    </motion.button>
                                </div>

                                <div className="space-y-4 overflow-y-auto scrollEditclass flex-1 pr-2">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Skill Name*</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full mt-1 bg-gray-800/70 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter skill name"
                                            />
                                            {!name.trim() && (
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
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Target Level</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {targetLevels.map((level) => (
                                                <motion.button
                                                    key={level}
                                                    type="button"
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className={classNames(
                                                        "py-2 px-3 rounded-lg text-sm font-medium transition",
                                                        targetLevel === level
                                                            ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                                                            : "bg-gray-800/70 text-gray-300 hover:bg-gray-700/50"
                                                    )}
                                                    onClick={() => setTargetLevel(level)}
                                                >
                                                    {level}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Current Level</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {currentLevels.map((level) => (
                                                <motion.button
                                                    key={level}
                                                    type="button"
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className={classNames(
                                                        "py-2 px-3 rounded-lg text-sm font-medium transition",
                                                        currentLevel === level
                                                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                                            : "bg-gray-800/70 text-gray-300 hover:bg-gray-700/50"
                                                    )}
                                                    onClick={() => setCurrentLevel(level)}
                                                >
                                                    {level}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
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
                                </div>
                            </div>

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
                                        disabled={!name.trim()}
                                        className={classNames(
                                            "rounded-lg px-4 py-2 text-sm font-semibold transition",
                                            name.trim()
                                                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
                                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                        )}
                                        onClick={handleSubmit}
                                    >
                                        Create Skill
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



export function AddDateCommentDialog({
    show,
    setShow,
}) {
    const cancelRef = useRef(null);
    const [comment, setComment] = useState('');
    const [date, setDate] = useState('');
    const [dateError, setDateError] = useState('');

    const [createEntry] = useAsyncMutation(useUpdateLevelMutation);

    useEffect(() => {
        // Set default date to today when dialog opens
        if (show) {
            const today = new Date().toISOString().split('T')[0];
            setDate(today);
        }
    }, [show]);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (new Date(selectedDate) > today) {
            setDateError('Future dates are not allowed');
        } else {
            setDateError('');
            setDate(selectedDate);
        }
    };

    const handleSubmit = async () => {
        if (!comment.trim()) return;
        if (dateError) return;

        setShow(false);
        await createEntry('Adding Entry...', {
            comment,
            didAt:date,
            id:show
        });
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

                <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto scrollEditclass">
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
                            className="w-full max-w-md rounded-2xl bg-gradient-to-br overflow-auto scrollEditclass from-gray-900 to-gray-800 shadow-xl shadow-purple-500/10 border border-gray-700/50 flex flex-col"
                            style={{ maxHeight: '90vh' }}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        Add New Entry
                                    </Dialog.Title>
                                    <motion.button
                                        whileHover={{ rotate: 90, scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShow(false)}
                                        className="p-1 rounded-full hover:bg-gray-800/50 transition"
                                    >
                                        <X className="text-gray-400 hover:text-white transition size-5" />
                                    </motion.button>
                                </div>

                                <div className="space-y-4 overflow-y-auto scrollEditclass flex-1 pr-2">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Date*</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                className="w-full mt-1 bg-gray-800/70 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500"
                                                value={date}
                                                onChange={handleDateChange}
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                            {dateError && (
                                                <motion.span
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-400"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    {dateError}
                                                </motion.span>
                                            )}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Comment*</label>
                                        <div className="relative">
                                            <textarea
                                                className="w-full mt-1 bg-gray-800/70 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500 min-h-[100px]"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Enter your comment"
                                            />
                                            {!comment.trim() && (
                                                <motion.span
                                                    className="absolute right-3 top-2 text-xs text-red-400"
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
                                        disabled={!comment.trim() || dateError}
                                        className={classNames(
                                            "rounded-lg px-4 py-2 text-sm font-semibold transition",
                                            comment.trim() && !dateError
                                                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
                                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                        )}
                                        onClick={handleSubmit}
                                    >
                                        Add Entry
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