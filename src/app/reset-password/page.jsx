"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    uppercase: false,
    specialChar: false,
  });

  // Check password requirements
  useEffect(() => {
    setPasswordRequirements({
      length: password.length >= 8,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const passwordsMatch = password === confirmPassword && password !== '';
  const isFormValid = Object.values(passwordRequirements).every(Boolean) && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || !token) return;

    setIsSubmitting(true);
    console.log(token)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password reset successfully!', {
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          }
        });
        router.push('/login');
      } else {
        toast.error(data.message || 'Password reset failed', {
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151'
          }
        });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800/70 border border-gray-700 rounded-xl shadow-lg shadow-purple-500/10 overflow-hidden backdrop-blur-sm"
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-center"
          >
            Reset Your Password
          </motion.h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition"
                placeholder="Enter new password"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition"
                placeholder="Confirm new password"
                required
              />
            </div>
            <AnimatePresence>
              {confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`text-sm mt-1 ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}
                >
                  {passwordsMatch ? 'Passwords match!' : 'Passwords do not match'}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-700/50 p-4 rounded-lg border border-gray-600"
          >
            <h3 className="text-sm font-medium text-gray-300 mb-2">Password Requirements</h3>
            <ul className="space-y-2">
              <RequirementItem 
                met={passwordRequirements.length} 
                text="At least 8 characters long" 
              />
              <RequirementItem 
                met={passwordRequirements.number} 
                text="Contains at least one number" 
              />
              <RequirementItem 
                met={passwordRequirements.uppercase} 
                text="Contains at least one uppercase letter" 
              />
              <RequirementItem 
                met={passwordRequirements.specialChar} 
                text="Contains at least one special character" 
              />
            </ul>
          </motion.div>

          <motion.button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            whileHover={isFormValid ? { scale: 1.02 } : {}}
            whileTap={isFormValid ? { scale: 0.98 } : {}}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center ${
              isFormValid && !isSubmitting
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/30'
                : 'bg-gray-700 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

function RequirementItem({ met, text }) {
  return (
    <motion.li 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center text-sm"
    >
      {met ? (
        <FiCheck className="text-green-400 mr-2" />
      ) : (
        <FiX className="text-red-400 mr-2" />
      )}
      <span className={met ? 'text-gray-300' : 'text-gray-500'}>{text}</span>
    </motion.li>
  );
}