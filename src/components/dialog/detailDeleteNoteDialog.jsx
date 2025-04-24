'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Trash2, Info, Check, ChevronDown, ChevronUp, BookOpen, FileText, Star } from 'lucide-react';
import { useAsyncMutation } from '@/hook/mutationHook';
import dayjs from 'dayjs';
import { useDeleteMutation } from '@/redux/api/diary';

export default function NoteDetailView({
  showData,
  setShowData
}) {
  const cancelRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [deleteNote] = useAsyncMutation(useDeleteMutation);

  const getTypeColor = (type) => {
    switch(type) {
      case 'diary': return 'bg-purple-500/10 text-purple-400';
      case 'filling': return 'bg-blue-500/10 text-blue-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'diary': return <BookOpen className="size-5" />;
      case 'filling': return <FileText className="size-5" />;
      default: return <Info className="size-5" />;
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteNote('Deleting Note...', showData._id);
      setShowData({});
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return dayjs(date).format("ddd, MMM D, YYYY");
  };

  return (
    <Transition.Root show={!!showData && Object.keys(showData).length > 0} as={Fragment}>
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

        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto scrollEditclass1">
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
              className="w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-xl border border-gray-700/50"
            >
              {/* Header with Favorite Star */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${getTypeColor(showData?.type)}`}>
                    {getTypeIcon(showData?.type)}
                  </div>
                  <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Note Details
                  </Dialog.Title>
                  {showData?.isFavorite && (
                    <Star className="size-5 text-yellow-400" fill="currentColor" />
                  )}
                </div>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowData({})}
                  className="p-1 rounded-full hover:bg-gray-800 transition"
                >
                  <X className="text-gray-400 hover:text-white transition size-5" />
                </motion.button>
              </div>

              <div className="space-y-6 max-h-[70vh] overflow-y-auto scrollEditclass1 pr-2">
                {/* Title Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Title</h3>
                  <p className="text-lg font-medium text-white break-words">
                    {showData?.title || 'Untitled Note'}
                  </p>
                </motion.div>

                {/* Image Gallery */}
                {showData?.imgUrl?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Photos</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {showData.imgUrl.map((img, index) => (
                        <motion.div
                          key={index+img}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 * index }}
                          className="aspect-square rounded-lg overflow-hidden border border-gray-700/50"
                        >
                          <img
                            src={img}
                            alt={`Note ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Content</h3>
                  <AnimatePresence mode="wait">
                    {showData?.content ? (
                      expanded ? (
                        <motion.p
                          key="expanded"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-gray-300 whitespace-pre-wrap"
                        >
                          {showData.content}
                        </motion.p>
                      ) : (
                        <motion.p
                          key="collapsed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-gray-300 line-clamp-3"
                        >
                          {showData.content}
                        </motion.p>
                      )
                    ) : (
                      <p className="text-gray-500 italic">No content provided</p>
                    )}
                  </AnimatePresence>
                  {showData?.content && showData.content.length > 150 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setExpanded(!expanded)}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-2"
                    >
                      {expanded ? (
                        <>
                          <ChevronUp className="size-4" /> Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="size-4" /> Read more
                        </>
                      )}
                    </motion.button>
                  )}
                </motion.div>

                {/* Note Details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Type</h3>
                    <div className={`px-3 py-2 rounded-lg capitalize ${getTypeColor(showData?.type)}`}>
                      {showData?.type || 'general'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date</h3>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50">
                      <Calendar className="size-4 text-purple-400" />
                      <span className="text-white">
                        {formatDate(showData?.forDate)}
                      </span>
                    </div>
                  </div>

                  {showData?.createdAt && (
                    <div className="space-y-2 col-span-2">
                      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Created</h3>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50">
                        <Calendar className="size-4 text-gray-400" />
                        <span className="text-gray-300">
                          {dayjs(showData.createdAt).format("MMM D, YYYY [at] h:mm A")}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Delete Button with Confirmation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 
                    ${isDeleting ? 
                      'bg-gray-800 text-gray-500 cursor-not-allowed' : 
                      'bg-red-900/40 text-red-300 hover:bg-red-900/50 border border-red-900/50 shadow-md shadow-red-900/10'}`}
                >
                  <Trash2 className="size-5" />
                  {isDeleting ? 'Deleting...' : 'Delete Note Permanently'}
                </motion.button>
              </motion.div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}