'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderPlus, X, Lock, Globe } from 'lucide-react';
import classNames from 'classnames';
import { useAsyncMutation } from '@/hook/mutationHook';
import { useAddMutation } from '@/redux/api/photo';

export default function AddFolderDialog({
  show,
  setShow,
}) {
  const cancelRef = useRef(null);
  const [name, setName] = useState('');
  const [isSecure, setIsSecure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addFolder] =  useAsyncMutation(useAddMutation);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    setShow(false);
    // Simulate API call
    await addFolder('Creating folder:', { name, isSecure });
    
    // Here you would typically call your API to create the folder
    // console.log('Creating folder:', { name, isSecure });
    
    setIsSubmitting(false);
    setName('');
    setIsSecure(false);
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
                    Create New Folder
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
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">Folder Name*</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full bg-gray-800/70 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter folder name"
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
                      name.trim()
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
                        Creating...
                      </>
                    ) : (
                      <>
                        <FolderPlus className="mr-1 size-4" />
                        Create Folder
                      </>
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