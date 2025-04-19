'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Calendar, Clock } from 'lucide-react';
import classNames from 'classnames';
import { useAsyncMutation } from '@/hook/mutationHook';
import { useAddWorkMutation } from '@/redux/api/work';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AddTaskWorkFormDialog({
  show,
  setShow,
  type = 'work',
  showTitle = true,
  showImage = true,
  showDate = true,
  showDay = true,
}) {
  const cancelRef = useRef(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [createWork, { isLoading, data, error }] = useAsyncMutation(useAddWorkMutation);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    setDate(formattedDate);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    
    setShow(false);
    if (type === 'task') {
      console.log('Task creation would go here');
    } else {
      await createWork('Creating Work...', { 
        title, 
        whenDoWork: selectedDay.toLowerCase() || 'anytime', 
        image: imagePreview 
      });
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate >= today) {
      setDate(selectedDate);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getDayColor = (day) => {
    switch(day.toLowerCase()) {
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
              className="w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-xl shadow-purple-500/10 border border-gray-700/50"
            >
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Add {type.charAt(0).toUpperCase() + type.slice(1)}
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
                {showTitle && (
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
                )}

                {showImage && (
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
                )}

                {showDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
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
                    </div>
                  </motion.div>
                )}

                {showDay && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-1">Schedule Day</label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((d) => (
                        <motion.button
                          key={d}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDay(prev => prev === d ? '' : d)}
                          className={classNames(
                            'px-3 py-1.5 rounded-lg border transition-all text-sm font-medium flex items-center gap-1',
                            selectedDay === d
                              ? `${getDayColor(d).replace('text-', '')} border-transparent shadow-md`
                              : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700/30 hover:text-white'
                          )}
                        >
                          {selectedDay === d && <Clock className="size-3.5" />}
                          {d.substring(0, 3)}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

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
                  disabled={!title.trim()}
                  className={classNames(
                    "rounded-lg px-4 py-2 text-sm font-semibold transition",
                    title.trim()
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/20 hover:shadow-lg"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  )}
                  onClick={handleSubmit}
                >
                  {isLoading ? 'Creating...' : `Create ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                </motion.button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}