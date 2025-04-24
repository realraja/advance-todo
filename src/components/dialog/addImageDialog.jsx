'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Lock, Globe, Loader2, Image, File } from 'lucide-react';
import classNames from 'classnames';
import { useAsyncMutation } from '@/hook/mutationHook';
import { useUploadFileMutation } from '@/redux/api/photo';
import toast from 'react-hot-toast';

export default function SingleFileUploadDialog({
    show,
    setShow,
    id,
}) {
    const cancelRef = useRef(null);
    const [name, setName] = useState('');
    const [isSecure, setIsSecure] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const [uploadFiles] = useAsyncMutation(useUploadFileMutation);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // console.log()

        if((file.size / 1024).toFixed(1) > 9900 && file.type.split('/')[0] !== 'video') return toast.error('File must Less than 10 MB')
        if((file.size / 1024).toFixed(1) > 99000) return toast.error('File must Less than 10 MB')

        setSelectedFile(file);

        // Create preview if it's an image
        if (file.type) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim() || !selectedFile) return;

        setIsSubmitting(true);

        try {


            // Then call your existing API
            await uploadFiles('Uploading file...', {
                name,
                isSecure,
                id,
                image: filePreview // Use the uploaded URL
            });

            setShow(false);
            resetForm();
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setName('');
        setIsSecure(false);
        setSelectedFile(null);
        setFilePreview(null);
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
                            className="w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl shadow-purple-500/10 border border-gray-700/50"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        Upload File
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

                                <div className="space-y-6">
                                    {/* Name Input */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Name*</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full bg-gray-800/70 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter a name for this file"
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

                                    {/* Visibility Toggle */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setIsSecure(false)}
                                                className={`p-3 rounded-lg border-2 transition-all ${!isSecure ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:border-gray-600'}`}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <Globe className={`size-5 mb-1 ${!isSecure ? 'text-purple-400' : 'text-gray-400'}`} />
                                                    <span className={`font-medium ${!isSecure ? 'text-white' : 'text-gray-400'}`}>Public</span>
                                                    <span className={`text-xs mt-1 ${!isSecure ? 'text-purple-300' : 'text-gray-500'}`}>Visible to everyone</span>
                                                </div>
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setIsSecure(true)}
                                                className={`p-3 rounded-lg border-2 transition-all ${isSecure ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:border-gray-600'}`}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <Lock className={`size-5 mb-1 ${isSecure ? 'text-purple-400' : 'text-gray-400'}`} />
                                                    <span className={`font-medium ${isSecure ? 'text-white' : 'text-gray-400'}`}>Private</span>
                                                    <span className={`text-xs mt-1 ${isSecure ? 'text-purple-300' : 'text-gray-500'}`}>Only visible to you</span>
                                                </div>
                                            </motion.button>
                                        </div>
                                    </motion.div>

                                    {/* File Upload */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-300 mb-2">File*</label>
                                        {!selectedFile ? (
                                            <motion.label
                                                whileHover={{ scale: 1.01 }}
                                                className="flex flex-col items-center justify-center px-4 py-6 bg-gray-800/50 border-2 border-dashed border-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700/30 transition group"
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                                                />
                                                <div className="text-center space-y-2">
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        className="p-3 flex justify-center items-center bg-gray-700/50 rounded-full group-hover:bg-purple-500/20 transition mx-auto"
                                                    >
                                                        <Upload className="text-gray-400 group-hover:text-purple-400 transition size-6" />
                                                    </motion.div>
                                                    <p className="text-gray-400 group-hover:text-gray-300 transition text-sm">
                                                        Click to upload a file
                                                    </p>
                                                </div>
                                            </motion.label>
                                        ) : (
                                            <div className="mt-1 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {filePreview ? (
                                                            <img
                                                                src={filePreview}
                                                                alt="Preview"
                                                                className="size-10 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="size-10 flex items-center justify-center bg-gray-700 rounded">
                                                                <File className="size-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-sm text-white">{selectedFile.name}</p>
                                                            <p className="text-xs text-gray-400">
                                                                {(selectedFile.size / 1024).toFixed(1)} KB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => {
                                                            setSelectedFile(null);
                                                            setFilePreview(null);
                                                            if (fileInputRef.current) {
                                                                fileInputRef.current.value = '';
                                                            }
                                                        }}
                                                        className="p-1 text-gray-400 hover:text-red-400 transition"
                                                    >
                                                        <X className="size-4" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        )}
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
                                        disabled={!name.trim() || !selectedFile || isSubmitting}
                                        className={classNames(
                                            "rounded-lg px-4 py-2 text-sm font-semibold transition flex items-center",
                                            name.trim() && selectedFile
                                                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30"
                                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                        )}
                                        onClick={handleSubmit}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                                Uploading...
                                            </>
                                        ) : (
                                            'Upload File'
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

