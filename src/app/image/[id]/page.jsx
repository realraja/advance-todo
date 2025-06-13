'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    PlusCircle,
    Copy,
    Lock,
    Globe,
    ImageIcon,
    FileText,
    File,
    FileVideo,
    FileAudio,
    FileSpreadsheet,
    FileQuestion,
    FileImage as ImageFileIcon,
    FileArchive as ArchiveIcon
} from 'lucide-react';

import { useGetAllFilesQuery } from '@/redux/api/photo';
import UploadFilesDialog from '@/components/dialog/addImageDialog';
import { toast } from 'react-hot-toast';

export default function FolderInnerPage() {
    const router = useRouter();
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [showAddFileDialog, setShowAddFileDialog] = useState(false);
    const [activeTab, setActiveTab] = useState('public');
    const [copiedId, setCopiedId] = useState(null);

    const { data } = useGetAllFilesQuery(params.id);

    useEffect(() => {
        if (data) {
            setFiles(data?.data?.files?.photos || []);
        }
    }, [data]);

    const handleAddFile = () => {
        setShowAddFileDialog(true);
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success('Link copied!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getFileIcon = (url) => {
        if (!url) return <FileQuestion className="size-5 text-gray-400" />;

        const extension = url.split('.').pop()?.toLowerCase();
        const resourceType = url.split('/upload/')[1]?.split('/')[0] || '';

        if (resourceType === 'image') return <ImageFileIcon className="size-5 text-blue-400" />;
        if (resourceType === 'video') return <FileVideo className="size-5 text-purple-400" />;
        if (resourceType === 'audio') return <FileAudio className="size-5 text-pink-400" />;

        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp':
                return <ImageFileIcon className="size-5 text-blue-400" />;
            case 'pdf':
            case 'doc':
            case 'docx':
                return <FileText className="size-5 text-red-400" />;
            case 'xls':
            case 'xlsx':
                return <FileSpreadsheet className="size-5 text-green-400" />;
            case 'zip':
            case 'rar':
                return <ArchiveIcon className="size-5 text-yellow-400" />;
            case 'mp3':
            case 'wav':
                return <FileAudio className="size-5 text-pink-400" />;
            case 'mp4':
            case 'mov':
            case 'avi':
                return <FileVideo className="size-5 text-purple-400" />;
            default:
                return <FileQuestion className="size-5 text-gray-400" />;
        }
    };

    const filteredFiles = files.filter(file =>
        activeTab === 'public' ? !file.isSecure : file.isSecure
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 sm:p-6">
            {/* Top Controls */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.push('/image')}
                    className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
                >
                    <ArrowLeft size={18} /> Back to Folders
                </button>

                <button
                    onClick={handleAddFile}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-purple-500/20"
                >
                    <PlusCircle size={18} /> Add File
                </button>
            </div>

            <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                📁 {data?.data?.files?.name || `Folder: ${params.id}`}
            </h1>

            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('public')}
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'public' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-300'}`}
                >
                    <Globe size={16} />
                    Public Files
                </button>
                <button
                    onClick={() => setActiveTab('private')}
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'private' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-300'}`}
                >
                    <Lock size={16} />
                    Private Files
                </button>
            </div>

            {/* File Grid */}
            {filteredFiles.length === 0 ? (
                <div className="text-center text-gray-500 mt-12">
                    No {activeTab} files in this folder yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredFiles.map((file) => (
                        <div
                            key={file._id}
                            className="bg-gray-800/50 border flex flex-col justify-between border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-purple-500/10 transition-all relative group"
                        >
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button
                                    onClick={() => copyToClipboard(file.imgUrl, file._id)}
                                    className="p-1.5 bg-gray-700/80 rounded-lg hover:bg-gray-600/80 transition"
                                    title="Copy link"
                                >
                                    <Copy size={16} className={copiedId === file._id ? 'text-green-400' : 'text-gray-300'} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-gray-700/50 rounded-lg">
                                    {getFileIcon(file.imgUrl)}
                                </div>
                                <div>
                                    <h2 className="font-semibold truncate max-w-[180px]">{file.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${file.isSecure ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {file.isSecure ? 'Private' : 'Public'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                {(() => {
                                    const url = file.imgUrl;
                                    const extension = url?.split('.').pop()?.toLowerCase();
                                    // console.log(['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension))

                                    if ( ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
                                        return (
                                            <div className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden">
                                                <img
                                                    src={url}
                                                    alt={'file.name'}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                                    <span className="text-xs text-white/80">Image</span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    if (['mp4', 'webm', 'mov'].includes(extension)) {
                                        return (
                                            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                                <video controls className="w-full h-full object-cover">
                                                    <source src={url} type={`video/${extension}`} />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        );
                                    }

                                    if (['mp3', 'wav'].includes(extension)) {
                                        return (
                                            <div className="bg-gray-800 rounded-lg p-3 flex items-center justify-center">
                                                <audio controls className="w-full">
                                                    <source src={url} type={`audio/${extension}`} />
                                                    Your browser does not support the audio element.
                                                </audio>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="aspect-video bg-gray-700/30 rounded-lg flex items-center justify-center">
                                            <div className="text-center p-4 flex flex-col justify-center items-center">
                                                <div className="mx-auto mb-2">
                                                    {getFileIcon(file.imgUrl)}
                                                </div>
                                                <p className="text-xs text-gray-400 capitalize">
                                                    {file.imgUrl?.split('.').pop().split('/').pop() || 'File'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="mt-3 flex justify-between items-center">
                                <p className="text-xs text-gray-400">
                                    {formatDate(file.createdAt)}
                                </p>
                                <a
                                    href={file.imgUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-purple-400 hover:text-purple-300 transition"
                                >
                                    Open
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddFileDialog && (
                <UploadFilesDialog
                    show={showAddFileDialog}
                    setShow={setShowAddFileDialog}
                    id={params.id}
                />
            )}
        </div>
    );
}


const fileItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hover: { 
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.1)"
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export function AnimatedFolderInnerPage() {
    const router = useRouter();
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [showAddFileDialog, setShowAddFileDialog] = useState(false);
    const [activeTab, setActiveTab] = useState('public');
    const [copiedId, setCopiedId] = useState(null);

    const { data } = useGetAllFilesQuery(params.id);

    useEffect(() => {
        if (data) {
            setFiles(data?.data?.files?.photos || []);
        }
    }, [data]);

    const handleAddFile = () => {
        setShowAddFileDialog(true);
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success('Link copied!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getFileIcon = (url) => {
        if (!url) return <FileQuestion className="size-5 text-gray-400" />;

        const extension = url.split('.').pop()?.toLowerCase();
        const resourceType = url.split('/upload/')[1]?.split('/')[0] || '';

        if (resourceType === 'image') return <ImageFileIcon className="size-5 text-blue-400" />;
        if (resourceType === 'video') return <FileVideo className="size-5 text-purple-400" />;
        if (resourceType === 'audio') return <FileAudio className="size-5 text-pink-400" />;

        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp':
                return <ImageFileIcon className="size-5 text-blue-400" />;
            case 'pdf':
            case 'doc':
            case 'docx':
                return <FileText className="size-5 text-red-400" />;
            case 'xls':
            case 'xlsx':
                return <FileSpreadsheet className="size-5 text-green-400" />;
            case 'zip':
            case 'rar':
                return <ArchiveIcon className="size-5 text-yellow-400" />;
            case 'mp3':
            case 'wav':
                return <FileAudio className="size-5 text-pink-400" />;
            case 'mp4':
            case 'mov':
            case 'avi':
                return <FileVideo className="size-5 text-purple-400" />;
            default:
                return <FileQuestion className="size-5 text-gray-400" />;
        }
    };

    const filteredFiles = files.filter(file =>
        activeTab === 'public' ? !file.isSecure : file.isSecure
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 sm:p-6"
        >
            {/* Top Controls */}
            <div className="flex justify-between items-center mb-6">
                <motion.button
                    onClick={() => router.push('/image')}
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
                >
                    <ArrowLeft size={18} /> Back to Folders
                </motion.button>

                <motion.button
                    onClick={handleAddFile}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-purple-500/20"
                >
                    <PlusCircle size={18} /> Add File
                </motion.button>
            </div>

            <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            >
                📁 {data?.data?.files?.name || `Folder: ${params.id}`}
            </motion.h1>

            {/* Tabs */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex mb-6 border-b border-gray-700"
            >
                <motion.button
                    onClick={() => setActiveTab('public')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 relative ${activeTab === 'public' ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
                >
                    <Globe size={16} />
                    Public Files
                    {activeTab === 'public' && (
                        <motion.div 
                            layoutId="activeTabIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </motion.button>
                <motion.button
                    onClick={() => setActiveTab('private')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 relative ${activeTab === 'private' ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}
                >
                    <Lock size={16} />
                    Private Files
                    {activeTab === 'private' && (
                        <motion.div 
                            layoutId="activeTabIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </motion.button>
            </motion.div>

            {/* File Grid */}
            {filteredFiles.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 mt-12"
                >
                    No {activeTab} files in this folder yet.
                </motion.div>
            ) : (
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1,
                                delayChildren: 0.2
                            }
                        }
                    }}
                >
                    {filteredFiles.map((file) => (
                        <motion.div
                            key={file._id}
                            variants={fileItemVariants}
                            whileHover="hover"
                            className="bg-gray-800/50 border flex flex-col justify-between border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-purple-500/10 transition-all relative group"
                        >
                            <motion.div 
                                className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100"
                                whileHover={{ scale: 1.1 }}
                            >
                                <button
                                    onClick={() => copyToClipboard(file.imgUrl, file._id)}
                                    className="p-1.5 bg-gray-700/80 rounded-lg hover:bg-gray-600/80 transition"
                                    title="Copy link"
                                >
                                    <Copy size={16} className={copiedId === file._id ? 'text-green-400' : 'text-gray-300'} />
                                </button>
                            </motion.div>

                            <div className="flex items-center gap-3 mb-3">
                                <motion.div 
                                    className="p-2 bg-gray-700/50 rounded-lg"
                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                >
                                    {getFileIcon(file.imgUrl)}
                                </motion.div>
                                <div>
                                    <h2 className="font-semibold truncate max-w-[180px]">{file.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <motion.span 
                                            className={`text-xs px-2 py-0.5 rounded-full ${file.isSecure ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {file.isSecure ? 'Private' : 'Public'}
                                        </motion.span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                {(() => {
                                    const url = file.imgUrl;
                                    const extension = url?.split('.').pop()?.toLowerCase();

                                    if (url?.includes('/image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
                                        return (
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden"
                                            >
                                                <motion.img
                                                    src={url}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                    initial={{ opacity: 0.9 }}
                                                    whileHover={{ opacity: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                                    <span className="text-xs text-white/80">Image</span>
                                                </div>
                                            </motion.div>
                                        );
                                    }

                                    if (['mp4', 'webm', 'mov'].includes(extension)) {
                                        return (
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="aspect-video bg-black rounded-lg overflow-hidden"
                                            >
                                                <video controls className="w-full h-full object-cover">
                                                    <source src={url} type={`video/${extension}`} />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </motion.div>
                                        );
                                    }

                                    if (['mp3', 'wav'].includes(extension)) {
                                        return (
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="bg-gray-800 rounded-lg p-3 flex items-center justify-center"
                                            >
                                                <audio controls className="w-full">
                                                    <source src={url} type={`audio/${extension}`} />
                                                    Your browser does not support the audio element.
                                                </audio>
                                            </motion.div>
                                        );
                                    }

                                    return (
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="aspect-video bg-gray-700/30 rounded-lg flex items-center justify-center"
                                        >
                                            <div className="text-center p-4 flex flex-col justify-center items-center">
                                                <motion.div 
                                                    className="mx-auto mb-2"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {getFileIcon(file.imgUrl)}
                                                </motion.div>
                                                <p className="text-xs text-gray-400 capitalize">
                                                    {file.imgUrl?.split('.').pop().split('/').pop() || 'File'}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })()}
                            </div>

                            <div className="mt-3 flex justify-between items-center">
                                <p className="text-xs text-gray-400">
                                    {formatDate(file.createdAt)}
                                </p>
                                <motion.a
                                    href={file.imgUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-purple-400 hover:text-purple-300 transition"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    Open
                                </motion.a>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {showAddFileDialog && (
                <UploadFilesDialog
                    show={showAddFileDialog}
                    setShow={setShowAddFileDialog}
                    id={params.id}
                />
            )}
        </motion.div>
    );
}