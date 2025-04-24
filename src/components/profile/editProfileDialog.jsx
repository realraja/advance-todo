'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState, useEffect } from 'react';
import { motion} from 'framer-motion';
import { Upload, X, Calendar, User, Image as ImageIcon } from 'lucide-react';
import classNames from 'classnames';
import { useUpdateProfileMutation } from '@/redux/api/user';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/slicer/auth';

export default function ProfileEditDialog({
    show,
    setShow,
    initialData = {}
}) {
    const cancelRef = useRef(null);
    const fileInputRef = useRef(null);
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [UpdateProfile] = useUpdateProfileMutation();

    const dispatch = useDispatch();

    // Initialize form with initial data
    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setDateOfBirth(initialData.dob?.split('T')[0] || '');
            setImagePreview(initialData.imgUrl || null);
        }
    }, [initialData]);

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Don't allow future dates for date of birth
        if (selectedDate <= today) {
            setDateOfBirth(selectedDate.toISOString().split('T')[0]);
        }
    };

    const getMaxDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };



    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate image file
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setSelectedFile(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeImage = () => {
        setImagePreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) return;
        
        setIsSubmitting(true);
        
        try {
            const toastId = toast.loading('Profile Updating...')
            const data = await UpdateProfile({name,image:imagePreview,dob:dateOfBirth})

            if(data.data.success){
                toast.success(data.data.message,{id:toastId})
                await dispatch(login(data.data.data.user))
            }else{
                toast.error(data.error.data.message,{id:toastId})
            }
            
            // console.log()
            setShow(false);
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setName(initialData.name || '');
        setDateOfBirth(initialData.dateOfBirth || '');
        setImagePreview(initialData.imageUrl || null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
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
                            className="w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl shadow-blue-500/10 border border-gray-700/50 flex flex-col"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                        Edit Profile
                                    </Dialog.Title>
                                    <motion.button
                                        whileHover={{ rotate: 90, scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            resetForm();
                                            setShow(false);
                                        }}
                                        className="p-1 rounded-full hover:bg-gray-800/50 transition"
                                    >
                                        <X className="text-gray-400 hover:text-white transition size-5" />
                                    </motion.button>
                                </div>

                                <div className="space-y-4">
                                    {/* Profile Image */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Profile Image</label>
                                        
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                {imagePreview ? (
                                                    <>
                                                        <img
                                                            src={imagePreview}
                                                            alt="Profile preview"
                                                            className="size-16 rounded-full object-cover border-2 border-blue-500/50"
                                                        />
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="absolute -top-1 -right-1 p-1 bg-gray-900/80 rounded-full hover:bg-red-500/80 transition shadow-lg"
                                                        >
                                                            <X className="text-white size-3" />
                                                        </motion.button>
                                                    </>
                                                ) : (
                                                    <div className="size-16 rounded-full bg-gray-700 flex items-center justify-center border-2 border-dashed border-gray-600">
                                                        <User className="text-gray-500 size-6" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                            />
                                            
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="button"
                                                onClick={triggerFileInput}
                                                className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 transition text-sm flex items-center gap-2"
                                            >
                                                <Upload className="size-4" />
                                                {imagePreview ? 'Change' : 'Upload'}
                                            </motion.button>
                                        </div>
                                    </motion.div>

                                    {/* Name Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Name*</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full mt-1 bg-gray-800/70 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-500"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter your name"
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

                                    {/* Date of Birth */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="relative"
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <Calendar className="text-gray-500 size-5" />
                                            </div>
                                            <input
                                                type="date"
                                                className="w-full bg-gray-800/70 text-white mt-1 rounded-lg pl-10 pr-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={dateOfBirth}
                                                onChange={handleDateChange}
                                                max={getMaxDate()}
                                            />
                                            
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
                                        disabled={!name.trim() || isSubmitting}
                                        className={classNames(
                                            "rounded-lg px-4 py-2 text-sm font-semibold transition",
                                            name.trim()
                                                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
                                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                        )}
                                        onClick={handleSubmit}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center">
                                                <span className="animate-spin mr-2">
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                                                        <path
                                                            fill="currentColor"
                                                            d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"
                                                        />
                                                    </svg>
                                                </span>
                                                Saving...
                                            </span>
                                        ) : (
                                            'Save Profile'
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