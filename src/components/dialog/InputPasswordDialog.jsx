"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

const PasswordInputDialog = ({ showData, setShowData, onSubmit }) => {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

//   console.log(showData)

  const handleClose = () => {
    setPassword("");
    setVisible(false);
    setShowData({});
  };

  const handleSubmit = () => {
    if (password.trim() !== "") {
      onSubmit({...showData,EnteredPassword:password});
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {Object.keys(showData || {}).length !== 0 && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Dialog */}
          <motion.div
            className="fixed z-50 top-1/2 left-1/2 w-full max-w-sm p-6 bg-gray-900 rounded-2xl border border-gray-700 shadow-xl transform -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Lock size={18} /> Enter Password
              </h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                className="w-full p-3 pr-10 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onClick={() => setVisible(!visible)}
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              className="w-full mt-5 bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold py-2 rounded-lg"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PasswordInputDialog;
