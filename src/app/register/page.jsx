"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import GoogleSignIn from '@/components/google/googleLogin';
import {  RegisterUser } from '@/utils/authRequests';
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
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const dispatch = useDispatch();
  const {isUser} = useSelector(state => state.auth);

  useEffect(() => {
    if(isUser) return router.push('/');
  },[router,isUser])

  // const yera = new Date().getFullYear();
  // console.log(yera)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
  
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const dobYear = new Date(dob).getFullYear();
      const currentYear = new Date().getFullYear();
      if (dobYear < 1950 || dobYear >= currentYear) {
        newErrors.dob = `Year must be between 1950 and ${currentYear - 1}`;
      }
    }
  
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = 'Invalid email address';
    }
  
    if (password.length < 8 || !/\d/.test(password)) {
      newErrors.password = 'Password must be at least 8 characters and include a number';
    }
  
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setButtonLoading(true);
      const data = await RegisterUser({image, name, email, password, dob});
      console.log(data);
      if(data.success){
        toast.success(data.message);
        console.log(data.data);
        await dispatch(login(data?.data));
        router.push('/')
      }else{
        toast.error(data.message);
      }    
      setButtonLoading(false);
  
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed: ' + error.message);
      setButtonLoading(false);
      
    }
    // console.log(data);
  };

  useEffect(() => {
    validate();
  }, [name, email, password, dob]);



  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-gray-900/60 border border-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md text-white space-y-6"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-center text-white"
        >
          Create Account
        </motion.h2>

        {/* Image Upload */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
          className="flex justify-center"
        >
          <label className="cursor-pointer">
            {image ? (
              <img src={image} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-purple-500" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-600">
                Upload
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
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
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.name && <p className="text-sm text-red-600/50 mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && <p className="text-sm text-red-600/50 mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && <p className="text-sm text-red-600/50 mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.dob && <p className="text-sm text-red-600/50 mt-1">{errors.dob}</p>}
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full cursor-pointer py-2 rounded-lg transition font-semibold ${
              isValid
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-purple-800 cursor-not-allowed opacity-60'
            }`}
          >
            {buttonLoading? <SyncLoader />: 'Register'}
          </button>
        </motion.form>

        {/* Google Login */}
        {/* <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full border border-gray-600 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-800 transition"
          
          // onClick={() => signIn('google')}
        >
          <FcGoogle size={20} />
          Sign up with Google
        </motion.button> */}
        <GoogleSignIn />

        {/* Login Link */}
        <p className="text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
