'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, Check, Copy, Lock, Globe, RefreshCw, Star } from 'lucide-react';
import { useAsyncMutation } from '@/hook/mutationHook';
import { useUpdateMutation } from '@/redux/api/password';

export default function EditPasswordDialog({
  showData,
  setShowData,
}) {
  const cancelRef = useRef(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSecure, setIsSecure] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState({
    length: 12,
    uppercase: true,
    numbers: true,
    symbols: true
  });

  const [updatePassword] = useAsyncMutation(useUpdateMutation);

  useEffect(() => {
    if (showData) {
      setName(showData.name || '');
      setUrl(showData.url || '');
      setUsername(showData.username || '');
      setPassword(showData.password || '');
      setIsSecure(showData.isSecure || false);
      setIsFavorite(showData.isFavorite || false);
    }
  }, [showData]);

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
      // Replace with your actual update mutation
      await updatePassword('Updating password...', {
        id: showData._id,
        name,
        url,
        username,
        password,
        isSecure
      });
      setShowData({});
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setIsSubmitting(false);
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-xl bg-gray-900 border border-gray-700 shadow-xl overflow-y-auto scrollEditclass1" style={{maxHeight:'90vh',}}>
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <Dialog.Title className="text-lg font-semibold text-white">
                      Edit Password
                    </Dialog.Title>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`p-1 rounded-full ${isFavorite ? 'text-yellow-400 bg-yellow-500/10' : 'text-gray-400 hover:text-yellow-400'}`}
                    >
                      <Star className="size-5" fill={isFavorite ? 'currentColor' : 'none'} />
                    </motion.button>
                  </div>
                  <button
                    onClick={() => setShowData({})}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name*</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. My Bank Account"
                    />
                  </div>

                  {/* URL Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
                    <input
                      type="url"
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>

                  {/* Username Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Username/Email</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username@example.com"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Password*</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-20"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
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
                          onClick={() => setShowPassword(!showPassword)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-gray-400 hover:text-purple-400 transition"
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
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
                  </div>

                  {/* Password Options */}
                  <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/50">
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
                  </div>

                  {/* Visibility Toggle */}
                  <div>
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
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex justify-end gap-3">
                  <button
                    ref={cancelRef}
                    onClick={() => setShowData({})}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!name.trim() || !password || isSubmitting}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                      !name.trim() || !password || isSubmitting
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}