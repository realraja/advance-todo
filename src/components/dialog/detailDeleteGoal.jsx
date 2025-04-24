'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Trash2, Info, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useAsyncMutation } from '@/hook/mutationHook';
import { useDeleteMutation } from '@/redux/api/goal';
import dayjs from 'dayjs';

export default function GoalDetailView({
  showData,
  setShowData
}) {
  const cancelRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [deleteGoal] = useAsyncMutation(useDeleteMutation);

  const getTypeColor = (type) => {
    switch(type) {
      case 'weekly': return 'bg-purple-500/10 text-purple-400';
      case 'monthly': return 'bg-blue-500/10 text-blue-400';
      case 'yearly': return 'bg-green-500/10 text-green-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'weekly': return <Calendar className="size-5" />;
      case 'monthly': return <Calendar className="size-5" />;
      case 'yearly': return <Calendar className="size-5" />;
      default: return <Info className="size-5" />;
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteGoal('Deleting Goal...', showData._id);
      setShowData(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    
    return dayjs(date).format("ddd, MMM D, YYYY");
  };

  const getDateColor = (dateString) => {
    if (!dateString) return 'text-gray-400';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-red-400";
    if (diffDays < 3) return "text-yellow-400";
    return "text-green-400";
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Transition.Child>

        <div  className="fixed inset-0 flex items-center justify-center p-4 scrollEditclass overflow-y-auto">
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
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${getTypeColor(showData?.type)}`}>
                    {getTypeIcon(showData?.type)}
                  </div>
                  <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Goal Details
                  </Dialog.Title>
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

              <div className="space-y-6 max-h-[70vh] overflow-y-auto scrollEditclass pr-2">
                {/* Title Section */}
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Title</h3>
                  <p className="text-lg font-medium text-white break-words">
                    {showData?.title || 'Untitled Goal'}
                  </p>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</h3>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full ${showData?.completed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      <Check className="size-4" />
                    </div>
                    <span className={`font-medium ${showData?.completed ? 'text-green-400' : 'text-yellow-400'}`}>
                      {showData?.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>

                {/* Image Preview */}
                {showData?.imgUrl && (
                  <div className="rounded-xl overflow-hidden border border-gray-700/50">
                    <img
                      src={showData.imgUrl}
                      alt="Goal preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxIDEiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMyNzJhMzEiLz48L3N2Zz4=';
                      }}
                    />
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Description</h3>
                  <AnimatePresence>
                    {showData?.description ? (
                      expanded ? (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-gray-300 whitespace-pre-wrap"
                        >
                          {showData.description}
                        </motion.p>
                      ) : (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-gray-300 line-clamp-3"
                        >
                          {showData.description}
                        </motion.p>
                      )
                    ) : (
                      <p className="text-gray-500 italic">No description provided</p>
                    )}
                  </AnimatePresence>
                  {showData?.description && showData.description.length > 150 && (
                    <button 
                      onClick={() => setExpanded(!expanded)}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
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
                    </button>
                  )}
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Due Date</h3>
                  <div className="flex items-center gap-3">
                    <Calendar className="text-purple-400 size-5 flex-shrink-0" />
                    <span className={`font-medium ${getDateColor(showData?.doBefore)}`}>
                      {formatDate(showData?.doBefore)}
                    </span>
                  </div>
                </div>

                {/* Goal Type */}
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Type</h3>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(showData?.type)}`}>
                      {getTypeIcon(showData?.type)}
                    </div>
                    <span className="font-medium text-white capitalize">
                      {showData?.type || 'general'}
                    </span>
                  </div>
                </div>

                {/* Created At */}
                {showData?.createdAt && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Created</h3>
                    <div className="flex items-center gap-3 text-gray-400">
                      <Calendar className="size-5 flex-shrink-0" />
                      <span className="text-sm">
                        {dayjs(showData.createdAt).format("MMM D, YYYY [at] h:mm A")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <div className="mt-8 flex justify-center">
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
                  {isDeleting ? 'Deleting...' : 'Delete Goal'}
                </motion.button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}