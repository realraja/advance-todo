"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle, FcLock } from 'react-icons/fc';
import { FiMail, FiEye, FiEyeOff, FiArrowRight, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { LoginUser } from '@/utils/authRequests';
import GoogleSignIn from '@/components/google/googleLogin';
import { SyncLoader } from 'react-spinners';
import { login } from '@/redux/slicer/auth';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { isUser } = useSelector(state => state.auth);

  useEffect(() => {
    if (isUser) return router.push('/');
  }, [router, isUser])

  const validate = () => {
    const newErrors = {};
    if (!email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  useEffect(() => {
    validate();
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setButtonLoading(true);
    const data = await LoginUser({ email, password });

    if (data.success) {
      toast.success(data.message);
      await dispatch(login(data?.data));
      router.push('/');
    } else {
      toast.error(data.message);
    }
    setButtonLoading(false);
  };

  const handleForgotPassword = async () => {
    setButtonLoading(true);
    let toastId;
    try {
      toastId = toast.loading('Sending Mail');
      const { data } = await axios.post('/api/auth/send-password-reset-link', { email });
  
      console.log(data);
      if (data.success) {
        toast.success(data.message, { id: toastId });
        setShowForgotPassword(false);
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch (error) {
      console.log(error);
      toast.error('Error sending reset link. Please try again.', { id: toastId });
    }finally{
      setButtonLoading(false)
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-md text-white space-y-6 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/20 rounded-full filter blur-xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-600/20 rounded-full filter blur-xl"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />

        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Welcome Back
        </motion.h2>

        <AnimatePresence mode="wait">
          {!showForgotPassword ? (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Login Form */}
              <motion.form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <motion.div
                    className="flex items-center bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-purple-500"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <FiMail className="text-gray-400 mr-2" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent focus:outline-none"
                    />
                  </motion.div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400 mt-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div>
                  <motion.div
                    className="flex items-center bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-purple-500"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <FcLock className="mr-2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-white"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </motion.div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400 mt-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-purple-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <motion.button
                  type="submit"
                  disabled={!isValid || buttonLoading}
                  whileHover={isValid && !buttonLoading ? { scale: 1.02 } : {}}
                  whileTap={isValid && !buttonLoading ? { scale: 0.98 } : {}}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${isValid && !buttonLoading
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30'
                      : 'bg-gray-700 cursor-not-allowed'
                    }`}
                >
                  {buttonLoading ? (
                    <SyncLoader color="#ffffff" size={8} />
                  ) : (
                    <>
                      Login <FiArrowRight />
                    </>
                  )}
                </motion.button>
              </motion.form>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="flex-shrink mx-4 text-gray-400">or</span>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>

              <GoogleSignIn />

              <p className="text-center text-gray-400">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="text-purple-400 hover:underline font-medium"
                >
                  Register
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-400">Reset Password</h3>
                <p className="text-gray-400 mt-2">
                  Enter your email to receive a reset link
                </p>
              </div>

              <div>
                <motion.div
                  className="flex items-center bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-purple-500"
                  whileFocus={{ scale: 1.01 }}
                >
                  <FiMail className="text-gray-400 mr-2" />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </motion.div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all"
                >
                  Back
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleForgotPassword}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 rounded-lg font-medium transition-all"
                >
                  {buttonLoading?<div className='flex justify-center items-center gap-2'>
                                  <FiLoader className="animate-spin mr-2" />
                                  Sending...
                                </div>:'Send Link'}
                  
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  ); 
}