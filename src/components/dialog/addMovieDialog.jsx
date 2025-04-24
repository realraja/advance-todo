'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ChevronDown, ChevronUp, Star, Clapperboard, Tv, Check, Upload, Image as ImageIcon, CalendarIcon, Film, Trash2 } from 'lucide-react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useAsyncMutation } from '@/hook/mutationHook';
import { useAddMutation, useDeleteMutation, useUpdateMutation, useUpdateWatchedMutation } from '@/redux/api/movie';

export default function AddMovieDialog({
    show,
    setShow
}) {
    const cancelRef = useRef(null);
    const fileInputRef = useRef(null);
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [type, setType] = useState('movie');
    const [status, setStatus] = useState('Started');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [watchDate, setWatchDate] = useState('');
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [activeImageTab, setActiveImageTab] = useState('url'); // 'url' or 'upload'


    const [AddMovie] = useAsyncMutation(useAddMutation);

    useEffect(() => {
        // Set default date to today
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setWatchDate(formattedDate);
    }, []);

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Don't allow future dates
        if (selectedDate <= today) {
            setWatchDate(selectedDate.toISOString().split('T')[0]);
        }
    };

    const getMaxDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const formatDateDisplay = (dateStr) => {
        const date = new Date(dateStr);
        return dayjs(date).format("MMM D, YYYY");
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                // For actual implementation, you would upload this to a server
                // and get back a URL to use
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeImage = () => {
        setImagePreview(null);
        setImageUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async() => {
        if (!title.trim()) return;
        console.log(status)
        
        const newMovie = {
            name:title, image:imagePreview || imageUrl, type,watchedAt:watchDate,comment:status,watched:status,rating
        };
        
        await AddMovie('Movie Adding...',newMovie);
        // resetForm();
        setShow(false);
    };

    const resetForm = () => {
        setTitle('');
        setImageUrl('');
        setImagePreview(null);
        setType('movie');
        setStatus('not_started');
        setRating(0);
        setWatchDate(new Date().toISOString().split('T')[0]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const renderStars = () => {
        return Array(10).fill(0).map((_, i) => {
            const ratingValue = i + 1;
            return (
                <motion.button
                    key={i}
                    type="button"
                    className="p-1"
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHoverRating(ratingValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Star
                        className={`size-6 transition-colors ${
                            (hoverRating || rating) >= ratingValue 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-500'
                        }`}
                    />
                </motion.button>
            );
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
                        className="fixed inset-0 bg-gradient-to-br from-black/90 to-blue-900/20 backdrop-blur-sm"
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
                            className="w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl shadow-blue-500/10 border border-gray-700/50 flex flex-col overflow-y-auto scrollEditclass"
                            style={{maxHeight:'90vh'}}
                       >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                        Add New Movie/Series
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

                                <div className="space-y-4">
                                    {/* Title Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Title*</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full mt-1 bg-gray-800/70 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-500"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Enter movie/series title"
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

                                    {/* Image Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Image</label>
                                        
                                        {/* Image Input Tabs */}
                                        <div className="flex border-b border-gray-700 mb-3">
                                            <button
                                                type="button"
                                                className={`px-4 py-2 text-sm font-medium transition ${
                                                    activeImageTab === 'url' 
                                                        ? 'text-blue-400 border-b-2 border-blue-400' 
                                                        : 'text-gray-400 hover:text-gray-300'
                                                }`}
                                                onClick={() => setActiveImageTab('url')}
                                            >
                                                URL
                                            </button>
                                            <button
                                                type="button"
                                                className={`px-4 py-2 text-sm font-medium transition ${
                                                    activeImageTab === 'upload' 
                                                        ? 'text-blue-400 border-b-2 border-blue-400' 
                                                        : 'text-gray-400 hover:text-gray-300'
                                                }`}
                                                onClick={() => setActiveImageTab('upload')}
                                            >
                                                Upload
                                            </button>
                                        </div>
                                        
                                        {/* URL Input */}
                                        {activeImageTab === 'url' && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="space-y-2"
                                            >
                                                <input
                                                    type="text"
                                                    className="w-full bg-gray-800/70 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-500"
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    placeholder="Paste image URL"
                                                />
                                                {imageUrl && (
                                                    <div className="relative">
                                                        <img
                                                            src={imageUrl}
                                                            alt="Preview"
                                                            className="w-full h-32 object-cover rounded-lg border border-gray-700"
                                                            onError={() => setImageUrl('')}
                                                        />
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="absolute top-2 right-2 p-1 bg-gray-900/80 rounded-full hover:bg-red-500/80 transition shadow-lg"
                                                        >
                                                            <X className="text-white size-3" />
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                        
                                        {/* File Upload */}
                                        {activeImageTab === 'upload' && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="space-y-2"
                                            >
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                    accept="image/*"
                                                />
                                                {imagePreview ? (
                                                    <div className="relative">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-32 object-cover rounded-lg border border-gray-700"
                                                        />
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="absolute top-2 right-2 p-1 bg-gray-900/80 rounded-full hover:bg-red-500/80 transition shadow-lg"
                                                        >
                                                            <X className="text-white size-3" />
                                                        </motion.button>
                                                    </div>
                                                ) : (
                                                    <motion.div
                                                        whileHover={{ scale: 1.01 }}
                                                        className="flex flex-col items-center justify-center px-4 py-6 bg-gray-800/50 border-2 border-dashed border-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700/30 transition group"
                                                        onClick={triggerFileInput}
                                                    >
                                                        <div className="text-center space-y-2">
                                                            <motion.div
                                                                whileHover={{ scale: 1.1 }}
                                                                className="p-3 flex justify-center items-center bg-gray-700/50 rounded-full group-hover:bg-blue-500/20 transition mx-auto"
                                                            >
                                                                <Upload className="text-gray-400 group-hover:text-blue-400 transition size-6" />
                                                            </motion.div>
                                                            <p className="text-gray-400 group-hover:text-gray-300 transition text-sm">
                                                                Click to upload an image
                                                            </p>
                                                            <p className="text-xs text-gray-500 group-hover:text-gray-400 transition">
                                                                JPG, PNG (max 5MB)
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </motion.div>

                                    {/* Type Selector */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Type*</label>
                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                            {[
                                                { value: 'movie', label: 'Movie', icon: <Clapperboard className="size-5" /> },
                                                { value: 'series', label: 'Series', icon: <Tv className="size-5" /> }
                                            ].map((item) => (
                                                <motion.button
                                                    key={item.value}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="button"
                                                    onClick={() => setType(item.value)}
                                                    className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                                                        type === item.value
                                                            ? 'bg-blue-500/20 border-blue-500/50 text-white'
                                                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                                                    }`}
                                                >
                                                    {item.icon}
                                                    <span>{item.label}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Status Selector */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Status*</label>
                                        <div className="grid grid-cols-3 gap-2 mt-1">
                                            {[
                                                { value: 'Started', label: 'Started' },
                                                { value: 'Half', label: 'Halfway' },
                                                { value: 'Full', label: 'Completed' }
                                            ].map((item) => (
                                                <motion.button
                                                    key={item.value}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="button"
                                                    onClick={() => setStatus(item.value)}
                                                    className={`p-2 rounded-lg border transition-all text-sm ${
                                                        status === item.value
                                                            ? 'bg-blue-500/20 border-blue-500/50 text-white'
                                                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                                                    }`}
                                                >
                                                    {status === item.value && (
                                                        <Check className="inline-block size-4 mr-1" />
                                                    )}
                                                    {item.label}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Rating */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Rating {rating > 0 && `(${rating}/10)`}
                                        </label>
                                        <div className="flex justify-center mt-2">
                                            {renderStars()}
                                        </div>
                                    </motion.div>

                                    {/* Watch Date */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 }}
                                        className="relative"
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Watch Date*</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <Calendar className="text-gray-500 size-5" />
                                            </div>
                                            <input
                                                type="date"
                                                className="w-full bg-gray-800/70 text-white mt-1 rounded-lg pl-10 pr-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={watchDate}
                                                onChange={handleDateChange}
                                                max={getMaxDate()}
                                            />
                                            <motion.button
                                                type="button"
                                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                                onClick={() => setDatePickerOpen(!datePickerOpen)}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                
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
                                                    <div className="mt-2 bg-gray-800/70 rounded-lg p-2 border border-gray-700">
                                                        <motion.button
                                                            type="button"
                                                            className={`w-full text-left p-2 rounded-md text-sm flex items-center gap-2 ${
                                                                watchDate === new Date().toISOString().split('T')[0] 
                                                                    ? 'bg-blue-600/30 text-white' 
                                                                    : 'text-gray-300 hover:bg-gray-700/50'
                                                            }`}
                                                            onClick={() => {
                                                                setWatchDate(new Date().toISOString().split('T')[0]);
                                                                setDatePickerOpen(false);
                                                            }}
                                                            whileHover={{ scale: 1.01 }}
                                                        >
                                                            <Calendar className="size-4 opacity-70" />
                                                            Today ({formatDateDisplay(new Date())})
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <div className="mt-1 text-xs text-blue-400">
                                            Cannot select future dates
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
                                        onClick={() => {
                                            resetForm();
                                            setShow(false);
                                        }}
                                        ref={cancelRef}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={!title.trim()}
                                        className={classNames(
                                            "rounded-lg px-4 py-2 text-sm font-semibold transition",
                                            title.trim()
                                                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
                                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                        )}
                                        onClick={handleSubmit}
                                    >
                                        Add Movie
                                        <motion.span 
                                            className="inline-block ml-1"
                                            whileHover={{ x: [0, 2, 0] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                        >
                                            🎬
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




export function AddWatchDateDialog({
    show,
    setShow,
    movie,
    onSuccess
}) {
    const cancelRef = useRef(null);
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('Full');
    const [dateError, setDateError] = useState('');

    const [addWatchDate] = useAsyncMutation(useUpdateWatchedMutation);

    const statusOptions = [
        { value: 'Full', label: 'Watched Full' },
        { value: 'Half', label: 'Watched Half' },
        { value: 'Started', label: 'Started Watching' }
    ];

    useEffect(() => {
        if (show) {
            // Set default date to today when dialog opens
            const today = new Date().toISOString().split('T')[0];
            setDate(today);
            setDateError('');
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
        if (dateError) return;

        setShow(false);
        await addWatchDate('Adding Watch Date...', {
            id: movie._id,
            watchedAt:date,
            watched:status
        });
        onSuccess?.();
    };

    const getStatusColor = (statusValue) => {
        switch (statusValue) {
            case 'Full': return 'bg-green-500/20 text-green-400';
            case 'Half': return 'bg-yellow-500/20 text-yellow-400';
            case 'Started': return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-gray-500/20 text-gray-400';
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
                                        Add Watch Date
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

                                <div className="space-y-6 overflow-y-auto scrollEditclass flex-1 pr-2">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Movie
                                        </label>
                                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                                            <img 
                                                src={movie.imgUrl} 
                                                alt={movie.name}
                                                className="w-12 h-12 rounded object-cover"
                                            />
                                            <div>
                                                <h4 className="text-white font-medium">{movie.name}</h4>
                                                <p className="text-xs text-gray-400 capitalize">{movie.type}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Watch Date*
                                        </label>
                                        <div className="relative">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="text-gray-400" size={18} />
                                                <input
                                                    type="date"
                                                    className="w-full mt-1 bg-gray-800/70 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500"
                                                    value={date}
                                                    onChange={handleDateChange}
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
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
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Watch Status*
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {statusOptions.map((option) => (
                                                <motion.button
                                                    key={option.value}
                                                    type="button"
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className={classNames(
                                                        "py-2 px-3 rounded-lg text-sm font-medium transition text-center",
                                                        status === option.value
                                                            ? `${getStatusColor(option.value)} ring-2 ring-current/50`
                                                            : "bg-gray-800/70 text-gray-300 hover:bg-gray-700/50"
                                                    )}
                                                    onClick={() => setStatus(option.value)}
                                                >
                                                    {option.label}
                                                </motion.button>
                                            ))}
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
                                        disabled={dateError}
                                        className={classNames(
                                            "rounded-lg px-4 py-2 text-sm font-semibold transition",
                                            !dateError
                                                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
                                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                        )}
                                        onClick={handleSubmit}
                                    >
                                        Add Watch Date
                                        <motion.span 
                                            className="inline-block ml-1"
                                            whileHover={{ x: [0, 2, 0] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                        >
                                            📅
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



export function EditMovieDialog({
    show,
    setShow,
    movie,
    onSuccess
}) {
    const cancelRef = useRef(null);
    const [name, setName] = useState('');
    const [type, setType] = useState('movie');
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [updateMovie] = useAsyncMutation(useUpdateMutation);
    const [deleteMovie] = useAsyncMutation(useDeleteMutation);

    useEffect(() => {
        if (movie && show) {
            setName(movie.name);
            setType(movie.type);
            setImagePreview(movie.imgUrl);
            setImageFile(null);
            setRating(movie.rating);
        }
    }, [movie, show]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setImageFile(null);
    };

    const handleSubmit = async () => {
        if (!name.trim()) return;
        setIsSubmitting(true);



        await updateMovie('Updating Movie...', {
            id: movie._id,
            name,type,image:imagePreview,rating
        });

        setIsSubmitting(false);
        setShow(false);
        onSuccess?.();
    };

    const handleDelete = async () =>{
        setShow(false)
        await deleteMovie("Deleting...",movie._id)
        onSuccess?.();
        // console.log(showData)
      }

    const renderStars = () => {
        return Array(10).fill(0).map((_, i) => {
            const ratingValue = i + 1;
            return (
                <motion.button
                    key={i}
                    type="button"
                    className="p-1"
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHoverRating(ratingValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Star
                        className={`size-6 transition-colors ${
                            (hoverRating || rating) >= ratingValue 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-500'
                        }`}
                    />
                </motion.button>
            );
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
                                        Edit Movie
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
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Movie Name*</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full mt-1 bg-gray-800/70 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter movie name"
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
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                className={classNames(
                                                    "py-2 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2",
                                                    type === 'movie'
                                                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                                                        : "bg-gray-800/70 text-gray-300 hover:bg-gray-700/50"
                                                )}
                                                onClick={() => setType('movie')}
                                            >
                                                <Film size={16} />
                                                Movie
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                className={classNames(
                                                    "py-2 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2",
                                                    type === 'series'
                                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                                        : "bg-gray-800/70 text-gray-300 hover:bg-gray-700/50"
                                                )}
                                                onClick={() => setType('series')}
                                            >
                                                <Tv size={16} />
                                                Series
                                            </motion.button>
                                        </div>
                                    </motion.div>

                                    {/* Rating */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Rating {rating > 0 && `(${rating}/10)`}
                                        </label>
                                        <div className="flex justify-center mt-2">
                                            {renderStars()}
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Poster Image</label>
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
                                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                        <motion.label
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="p-2 bg-gray-900/80 rounded-full hover:bg-purple-500/80 transition shadow-lg cursor-pointer"
                                                        >
                                                            <Upload className="text-white size-4" />
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                onChange={handleImageChange}
                                                                accept="image/*"
                                                            />
                                                        </motion.label>
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
                                        disabled={!name.trim() || isSubmitting}
                                        className={classNames(
                                            "rounded-lg px-4 py-2 text-sm font-semibold transition flex items-center",
                                            name.trim() && !isSubmitting
                                                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
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
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                Update Movie
                                                <motion.span 
                                                    className="inline-block ml-1"
                                                    whileHover={{ x: [0, 2, 0] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                >
                                                    ✨
                                                </motion.span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                                 {/* Delete Button */}
                                                <div className="mt-8 flex justify-center">
                                                              <motion.button
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.97 }}
                                                                onClick={handleDelete}
                                                                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 
                                                                  bg-red-900/40 text-red-300 hover:bg-red-900/50 border border-red-900/50 shadow-md shadow-red-900/10`}
                                                              >
                                                                <Trash2 className="size-5" />
                                                                Delete Permanently
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