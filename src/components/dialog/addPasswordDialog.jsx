'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Globe, Copy, Check, RefreshCw } from 'lucide-react';
import classNames from 'classnames';
import { useAsyncMutation } from '@/hook/mutationHook';
import { useAddMutation } from '@/redux/api/password';

export default function AddPasswordFormDialog({
  show,
  setShow,
}) {
  const cancelRef = useRef(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSecure, setIsSecure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    length: 12,
    uppercase: true,
    numbers: true,
    symbols: true
  });

  const [addPassword] = useAsyncMutation(useAddMutation);

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = lowercase;
    if (options.uppercase) charset += uppercase;
    if (options.numbers) charset += numbers;
    if (options.symbols) charset += symbols;

    let generatedPassword = '';
    for (let i = 0; i < options.length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    setPassword(generatedPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await addPassword('Adding password...', {
        name,
        url,
        username,
        password,
        isSecure
      });
      setShow(false);
      resetForm();
    } catch (error) {
      console.error('Error adding password:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setUrl('');
    setUsername('');
    setPassword('');
    setIsSecure(false);
  };

  useEffect(() => {
    if (show) {
      generatePassword();
    }
  }, [show, options]);

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
              className="w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl shadow-purple-500/10 border border-gray-700/50 overflow-y-auto scrollEditclass1"
              style={{ maxHeight: '90vh' }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Add New Password
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
                  {/* Name Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name*</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full bg-gray-800/70 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. My Bank Account"
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

                  {/* URL Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
                    <input
                      type="url"
                      className="w-full bg-gray-800/70 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </motion.div>

                  {/* Username Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-1">Username/Email</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800/70 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username@example.com"
                    />
                  </motion.div>

                  {/* Password Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-1">Password*</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full bg-gray-800/70 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-500 pr-20"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Generate or enter password"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <motion.button
                          type="button"
                          onClick={copyToClipboard}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-gray-400 hover:text-purple-400 transition"
                          title="Copy password"
                        >
                          {copied ? <Check className="size-5 text-green-400" /> : <Copy className="size-5" />}
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={generatePassword}
                          whileHover={{ rotate: 180 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-gray-400 hover:text-blue-400 transition"
                          title="Generate new password"
                        >
                          <RefreshCw className="size-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Password Options */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/50"
                  >
                    <h4 className="text-xs font-medium text-gray-400 mb-2">PASSWORD OPTIONS</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-300">Length: {options.length}</label>
                        <input
                          type="range"
                          min="8"
                          max="24"
                          value={options.length}
                          onChange={(e) => setOptions({...options, length: parseInt(e.target.value)})}
                          className="w-24 accent-purple-500"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.uppercase}
                            onChange={(e) => setOptions({...options, uppercase: e.target.checked})}
                            className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-300">Uppercase</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.numbers}
                            onChange={(e) => setOptions({...options, numbers: e.target.checked})}
                            className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-300">Numbers</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.symbols}
                            onChange={(e) => setOptions({...options, symbols: e.target.checked})}
                            className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-300">Symbols</span>
                        </label>
                      </div>
                    </div>
                  </motion.div>

                  {/* Visibility Toggle */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
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

              <div className="p-6 pt-0 overflow-y-auto scrollEditclass1">
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
                    disabled={!name.trim() || !password || isSubmitting}
                    className={classNames(
                      "rounded-lg px-4 py-2 text-sm font-semibold transition flex items-center",
                      name.trim() && password
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
                        Saving...
                      </>
                    ) : (
                      'Save Password'
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