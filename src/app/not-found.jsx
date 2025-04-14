"use client";
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { PacmanLoader } from 'react-spinners'
import Link from 'next/link';

const Notfound = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh]  z-[-2] bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] text-white p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="text-9xl font-bold"
      >
        404
      </motion.div>
      <PacmanLoader
  color="#770fd7"
  margin={5}
  size={40}
/>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
        className="text-2xl mb-4"
      >
        Oops! Page not found.
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="text-lg mb-8"
      >
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link href="/" className="px-6 py-2 bg-indigo-600 rounded-md text-white">
          Go to Homepage
        </Link>
      </motion.div>
    </div>
  )
}

export default Notfound
