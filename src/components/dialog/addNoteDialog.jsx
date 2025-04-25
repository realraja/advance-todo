'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Calendar, ChevronDown, ChevronUp, File, Image, BookOpen, FileText } from 'lucide-react';
import classNames from 'classnames';
import { useAsyncMutation } from '@/hook/mutationHook';
import { useAddMutation } from '@/redux/api/diary';
import dayjs from 'dayjs';

export default function AddNoteFormDialog({
    show,
    setShow,
}) {
    const cancelRef = useRef(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [type, setType] = useState('diary');
    const [fileInputKey, setFileInputKey] = useState(0);

    const [createNote] = useAsyncMutation(useAddMutation);

    useEffect(() => {
        // Set default date to today
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setDate(formattedDate);
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImagePreviews = [];
            const newFilePreviews = [...filePreviews];
            
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        newImagePreviews.push(reader.result);
                        if (newImagePreviews.length === files.length) {
                            setImagePreviews([...imagePreviews, ...newImagePreviews]);
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    newFilePreviews.push({
                        name: file.name,
                        type: file.type,
                        size: file.size
                    });
                }
            });
            
            setFilePreviews(newFilePreviews);
            setFileInputKey(prev => prev + 1); // Reset file input
        }
    };

    const removeImage = (index) => {
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const removeFile = (index) => {
        setFilePreviews(filePreviews.filter((_, i) => i !== index));
    };


    // const handleSubmit = async () => {
    //     if (!name.trim() || filePreviews.length === 0) return;
        
    //     setIsSubmitting(true);
        
    //     try {
          
          
    //   await createNote({
    //     title, images:imagePreviews, forDate:date, content,type
    //   })
    //     } catch (error) {
    //       console.error('Upload error:', error);
    //       // Handle error (show toast, etc.)
    //     } finally {
    //       setIsSubmitting(false);
    //     }
    //   };

    const handleSubmit = async () => {
        if (!title.trim()) return;
        if (!content.trim()) return;

        setShow(false);
        await createNote('Creating Note...', {
            type,
            title,
            content,
            forDate:date,
            images: imagePreviews,
            files: filePreviews
        });
    };

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Only allow dates from last week to today
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        lastWeek.setHours(0, 0, 0, 0);

        if (selectedDate >= lastWeek && selectedDate <= today) {
            setDate(selectedDate.toISOString().split('T')[0]);
        }
    };

    const getMinDate = () => {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        return lastWeek.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getDateOptions = () => {
        const options = [];
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        for (let d = new Date(lastWeek); d <= today; d.setDate(d.getDate() + 1)) {
            options.push(new Date(d));
        }
        
        return options;
    };

    const formatDateDisplay = (dateStr) => {
        const date = new Date(dateStr);
        return dayjs(date).format("ddd, MMM D");
    };

    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return <FileText className="size-5 text-red-400" />;
        if (fileType.includes('word')) return <FileText className="size-5 text-blue-400" />;
        if (fileType.includes('excel')) return <FileText className="size-5 text-green-400" />;
        return <File className="size-5 text-gray-400" />;
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
                            className="w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl shadow-purple-500/10 border border-gray-700/50 flex flex-col overflow-y-auto scrollEditclass"
                            style={{ maxHeight: '90vh' }}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        Add New Note
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
                                    {/* Note Type Selector */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Note Type*</label>
                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                            {['diary', 'filling'].map((noteType) => (
                                                <motion.button
                                                    key={noteType}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="button"
                                                    onClick={() => setType(noteType)}
                                                    className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                                                        type === noteType
                                                            ? 'bg-purple-500/20 border-purple-500/50 text-white'
                                                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                                                    }`}
                                                >
                                                    {noteType === 'diary' ? (
                                                        <BookOpen className="size-5" />
                                                    ) : (
                                                        <FileText className="size-5" />
                                                    )}
                                                    <span className="capitalize">{noteType}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Title Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Title*</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full mt-1 bg-gray-800/70 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Enter note title"
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

                                    {/* Content Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Content*</label>
                                        <div className="relative">
                                            <textarea
                                                className="w-full mt-1 bg-gray-800/70 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500 min-h-[100px]"
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="Write your note content here..."
                                            />
                                            {!content.trim() && (
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

                                    {/* Date Picker */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                        className="relative"
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Date*</label>
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
                                                max={getMaxDate()}
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
                                                                className={`w-full text-left p-2 rounded-md text-sm flex items-center gap-2 ${
                                                                    date === option.toISOString().split('T')[0] 
                                                                        ? 'bg-purple-600/30 text-white' 
                                                                        : 'text-gray-300 hover:bg-gray-700/50'
                                                                }`}
                                                                onClick={() => {
                                                                    setDate(option.toISOString().split('T')[0]);
                                                                    setDatePickerOpen(false);
                                                                }}
                                                                whileHover={{ scale: 1.01 }}
                                                            >
                                                                <Calendar className="size-4 opacity-70" />
                                                                {formatDateDisplay(option)}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <div className="mt-1 text-xs text-purple-400">
                                            Select a date from the last week to today
                                        </div>
                                    </motion.div>

                                    {/* File Upload */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Attachments</label>
                                        <motion.label
                                            whileHover={{ scale: 1.01 }}
                                            className="flex flex-col items-center justify-center px-4 py-6 bg-gray-800/50 border-2 border-dashed border-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700/30 transition group"
                                        >
                                            <input
                                                key={fileInputKey}
                                                type="file"
                                                className="hidden"
                                                onChange={handleImageChange}
                                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                                multiple
                                            />
                                            <div className="text-center space-y-2">
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className="p-3 flex justify-center items-center bg-gray-700/50 rounded-full group-hover:bg-purple-500/20 transition mx-auto"
                                                >
                                                    <Upload className="text-gray-400 group-hover:text-purple-400 transition size-6" />
                                                </motion.div>
                                                <p className="text-gray-400 group-hover:text-gray-300 transition text-sm">
                                                    Click to upload files or images
                                                </p>
                                                <p className="text-xs text-gray-500 group-hover:text-gray-400 transition">
                                                    Images, PDF, Word, Excel (max 10MB each)
                                                </p>
                                            </div>
                                        </motion.label>

                                        {/* Image Previews */}
                                        {imagePreviews.length > 0 && (
                                            <div className="mt-4 space-y-3">
                                                <h4 className="text-xs font-medium text-gray-400 flex items-center gap-2">
                                                    <Image className="size-4" /> Images ({imagePreviews.length})
                                                </h4>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {imagePreviews.map((preview, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="relative aspect-square"
                                                        >
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${index}`}
                                                                className="w-full h-full object-cover rounded-lg border border-gray-700"
                                                            />
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute top-1 right-1 p-1 bg-gray-900/80 rounded-full hover:bg-red-500/80 transition shadow-lg"
                                                            >
                                                                <X className="text-white size-3" />
                                                            </motion.button>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* File Previews */}
                                        {filePreviews.length > 0 && (
                                            <div className="mt-4 space-y-3">
                                                <h4 className="text-xs font-medium text-gray-400 flex items-center gap-2">
                                                    <File className="size-4" /> Files ({filePreviews.length})
                                                </h4>
                                                <div className="space-y-2">
                                                    {filePreviews.map((file, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg border border-gray-700/50"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {getFileIcon(file.type)}
                                                                <div>
                                                                    <p className="text-sm text-white line-clamp-1">{file.name}</p>
                                                                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                                                </div>
                                                            </div>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                type="button"
                                                                onClick={() => removeFile(index)}
                                                                className="p-1 text-gray-400 hover:text-red-400 transition"
                                                            >
                                                                <X className="size-4" />
                                                            </motion.button>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
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
                                        disabled={!title.trim() || !content.trim()}
                                        className={classNames(
                                            "rounded-lg px-4 py-2 text-sm font-semibold transition",
                                            title.trim() && content.trim()
                                                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
                                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                        )}
                                        onClick={handleSubmit}
                                    >
                                        Create Note
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