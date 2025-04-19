"use client";
import { TaskPage } from "@/components/workAndTask/taskPage";
import { WorkPage } from "@/components/workAndTask/workPage";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LayoutGrid, List, CalendarDays } from "lucide-react";

const Page = () => {
  const [activeTab, setActiveTab] = useState("work");
  const [viewMode, setViewMode] = useState("grid");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      {/* Animated Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Productivity Dashboard
        </h1>
        <p className="text-gray-400 mt-2">Manage your work and tasks efficiently</p>
      </motion.header>

      {/* Tab Navigation */}
      <motion.div 
        className="flex justify-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
          {["work", "task"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* View Mode Toggle */}
      <motion.div 
        className="flex justify-end mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex space-x-2 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid" ? "bg-purple-600/20 text-purple-400" : "text-gray-400 hover:text-white"
            }`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list" ? "bg-purple-600/20 text-purple-400" : "text-gray-400 hover:text-white"
            }`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "calendar" ? "bg-purple-600/20 text-purple-400" : "text-gray-400 hover:text-white"
            }`}
          >
            <CalendarDays size={18} />
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-12"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === "work" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === "work" ? -20 : 20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "work" ? (
              <WorkPage />
            ) : (
              <TaskPage />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Animated Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center text-gray-500 text-sm"
      >
        <p>© {new Date().getFullYear()} Productivity App. All rights reserved.</p>
      </motion.footer>
    </div>
  );
};

export default Page;