"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle, FcAddImage } from 'react-icons/fc';
import { FiUser, FiMail, FiLock, FiCalendar, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import GoogleSignIn from '@/components/google/googleLogin';
import { RegisterUser } from '@/utils/authRequests';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { SyncLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/slicer/auth';

export default function Register() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { isUser } = useSelector(state => state.auth);

  useEffect(() => {
    if (isUser) return router.push('/');
  }, [router, isUser]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
  
    if (!name.trim()) newErrors.name = 'Name is required';
    else if (name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    
    if (!dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const dobDate = new Date(dob);
      const dobYear = dobDate.getFullYear();
      const currentYear = new Date().getFullYear();
      const minAgeYear = currentYear - 120;
      
      if (dobYear < minAgeYear || dobYear >= currentYear) {
        newErrors.dob = `Year must be between ${minAgeYear} and ${currentYear - 1}`;
      } else if (currentYear - dobYear < 13) {
        newErrors.dob = 'You must be at least 13 years old';
      }
    }
  
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = 'Invalid email address';
    }
  
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/\d/.test(password)) {
      newErrors.password = 'Password must include a number';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must include an uppercase letter';
    }
  
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setButtonLoading(true);
      const data = await RegisterUser({ image, name, email, password, dob });
      
      if (data.success) {
        toast.success(data.message);
        await dispatch(login(data?.data));
        router.push('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    validate();
  }, [name, email, password, dob]);

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
          Join Us Today
        </motion.h2>

        {/* Image Upload */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
          className="flex justify-center"
        >
          <label className="cursor-pointer group">
            <div className="relative">
              {image ? (
                <motion.img 
                  src={image} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-600 group-hover:border-purple-500 transition-colors">
                  <FcAddImage size={32} />
                </div>
              )}
              <motion.div 
                className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-1"
                whileHover={{ scale: 1.1 }}
              >
                <FiArrowRight className="text-white" />
              </motion.div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
            />
          </label>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <motion.div 
              className="flex items-center bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-purple-500"
              whileFocus={{ scale: 1.01 }}
            >
              <FiUser className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
              />
            </motion.div>
            <AnimatePresence>
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-red-400 mt-1"
                >
                  {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

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
            <AnimatePresence>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-red-400 mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <motion.div 
              className="flex items-center bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-purple-500"
              whileFocus={{ scale: 1.01 }}
            >
              <FiLock className="text-gray-400 mr-2" />
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
            <AnimatePresence>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-red-400 mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <motion.div 
              className="flex items-center bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-purple-500"
              whileFocus={{ scale: 1.01 }}
            >
              <FiCalendar className="text-gray-400 mr-2" />
              <input
                type="date"
                value={dob}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-300"
              />
            </motion.div>
            <AnimatePresence>
              {errors.dob && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm text-red-400 mt-1"
                >
                  {errors.dob}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            disabled={!isValid || buttonLoading}
            whileHover={isValid && !buttonLoading ? { scale: 1.02 } : {}}
            whileTap={isValid && !buttonLoading ? { scale: 0.98 } : {}}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              isValid && !buttonLoading
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30'
                : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            {buttonLoading ? (
              <SyncLoader color="#ffffff" size={8} />
            ) : (
              <>
                Register <FiArrowRight />
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
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="text-purple-400 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}