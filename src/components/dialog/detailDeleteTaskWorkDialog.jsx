'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Trash2 } from 'lucide-react';
import { useAsyncMutation } from '@/hook/mutationHook';
import { useDeleteWorkMutation } from '@/redux/api/work';
import { useDeleteTaskMutation } from '@/redux/api/task';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function DetailViewWithDelete({
  showData,
  setShowData
}) {
  const cancelRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteWork] = useAsyncMutation(useDeleteWorkMutation);
  const [deleteTask] = useAsyncMutation(useDeleteTaskMutation);

  const getDayColor = (day) => {
    if (!day) return 'bg-gray-500/20 text-gray-400';
    const lowerDay = day.toLowerCase();
    switch(lowerDay) {
      case 'sunday': return 'bg-red-500/20 text-red-400';
      case 'monday': return 'bg-blue-500/20 text-blue-400';
      case 'tuesday': return 'bg-purple-500/20 text-purple-400';
      case 'wednesday': return 'bg-green-500/20 text-green-400';
      case 'thursday': return 'bg-yellow-500/20 text-yellow-400';
      case 'friday': return 'bg-indigo-500/20 text-indigo-400';
      case 'saturday': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (showData?.type === 'task') {
        await deleteTask('Deleting Task...', showData._id );
      } else {
        await deleteWork('Deleting Work...', showData._id );
      }
      setShowData(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
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

        <div className="fixed inset-0 flex items-center justify-center p-4">
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
              className="w-full max-w-md rounded-2xl bg-gray-900 p-6 shadow-xl border border-gray-700/50"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10">
                    {showData?.type === 'task' ? (
                      <Calendar className="size-5 text-purple-400" />
                    ) : (
                      <Clock className="size-5 text-blue-400" />
                    )}
                  </div>
                  <Dialog.Title className="text-xl font-semibold text-white">
                    {showData?.type === 'task' ? 'Task Details' : 'Work Details'}
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

              <div className="space-y-6">
                {/* Title Section */}
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Title</h3>
                  <p className="text-lg font-medium text-white break-words">
                    {showData?.title || 'Untitled'}
                  </p>
                </div>

                {/* Image Preview */}
                {showData?.imgUrl && (
                  <div className="rounded-xl overflow-hidden border border-gray-700/50">
                    <img
                      src={showData.imgUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxIDEiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMyNzJhMzEiLz48L3N2Zz4=';
                      }}
                    />
                  </div>
                )}

                {/* Date or Day Section */}
                {showData?.type === 'task' ? (
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Due Date</h3>
                    <div className="flex items-center gap-3 text-white">
                      <Calendar className="text-purple-400 size-5 flex-shrink-0" />
                      <span className="font-medium">{formatDate(showData?.doTaskOn?.split('T')[0])}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Scheduled Day</h3>
                    <div className="flex items-center gap-3">
                      <Clock className="text-blue-400 size-5 flex-shrink-0" />
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getDayColor(showData?.whenDoWork)}`}>
                        {showData?.whenDoWork ? 
                          daysOfWeek.find(d => d.toLowerCase() === showData.whenDoWork.toLowerCase()) || 'Anytime' : 
                          'Anytime'}
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
                  {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </motion.button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}