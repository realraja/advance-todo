"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { LoginUser } from '@/utils/authRequests';
import GoogleSignIn from '@/components/google/googleLogin';
import { SyncLoader } from 'react-spinners';
import { login } from '@/redux/slicer/auth';
import { useDispatch, useSelector } from 'react-redux';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch(); 
  const {isUser} = useSelector(state => state.auth);

  useEffect(() => {
    if(isUser) return router.push('/');
  },[router,isUser])

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
    console.log(data);
    if (data.success) {
      toast.success(data.message);
      
      await dispatch(login(data?.data));
      router.push('/')
    } else {
      toast.error(data.message);
    }
    setButtonLoading(false);
  };

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
          className="text-3xl font-extrabold text-center"
        >
          Welcome Back
        </motion.h2>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full cursor-pointer py-2 rounded-lg font-semibold transition ${isValid
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-purple-800 cursor-not-allowed opacity-60'
              }`}
          >
            {buttonLoading? <SyncLoader />: 'Login'}
          </button>
        </motion.form>

        {/* Google Login */}
        {/* <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full border border-gray-600 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-800 transition"
          onClick={() => alert('Implement Google login with NextAuth')}
        >
          <FcGoogle size={20} />
          Sign in with Google
        </motion.button> */}
        <GoogleSignIn />


        {/* Register Link */}
        <p className="text-center text-gray-400">
          Don’t have an account?{' '}
          <Link href="/register" className="text-purple-400 hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
