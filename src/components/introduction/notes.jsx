'use client';
import { motion } from 'framer-motion';
import { Notebook, Pen, Sparkles, Lock, Search, Tags, Share, Archive, Star } from 'lucide-react';
import Link from 'next/link';

export default function NotesIntroduction() {
  const features = [
    {
      icon: <Pen className="w-8 h-8 text-blue-400" />,
      title: "Rich Editing",
      description: "Format text with headings, lists, and markdown support for beautiful notes",
      animation: { y: [0, -10, 0] }
    },
    {
      icon: <Lock className="w-8 h-8 text-purple-400" />,
      title: "End-to-End Encrypted",
      description: "Your notes are secured with military-grade encryption",
      animation: { scale: [1, 1.1, 1] }
    },
    {
      icon: <Search className="w-8 h-8 text-green-400" />,
      title: "Instant Search",
      description: "Find any note in milliseconds with our powerful search engine",
      animation: { rotate: [0, 5, -5, 0] }
    },
    {
      icon: <Tags className="w-8 h-8 text-yellow-400" />,
      title: "Smart Organization",
      description: "Tags, folders, and nested notebooks keep everything tidy",
      animation: { x: [0, 5, -5, 0] }
    },
    {
      icon: <Share className="w-8 h-8 text-pink-400" />,
      title: "Collaborate Securely",
      description: "Share notes with team members with granular permissions",
      animation: { y: [0, -5, 0] }
    },
    {
      icon: <Archive className="w-8 h-8 text-indigo-400" />,
      title: "Version History",
      description: "Go back in time to any version of your note",
      animation: { scale: [1, 1.05, 1] }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-200">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/30">
            <Notebook className="w-12 h-12 text-blue-400" />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6"
        >
          Your Thoughts, Organized
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl text-gray-400 max-w-3xl mx-auto mb-10"
        >
          Capture ideas, organize knowledge, and unleash your creativity with our beautiful, secure notes platform.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex justify-center gap-4"
        >
          <Link href={'/login'} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Get Started
          </Link>
          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all">
            Learn More
          </button>
        </motion.div>
      </div>

      {/* Animated Demo Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-radial from-purple-500/10 to-transparent opacity-40"></div>
        </div>
        
        <motion.div 
          className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="p-4 bg-gray-900/50 border-b border-gray-700 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
              <h2 className="text-2xl font-bold text-white">Welcome to Your New Notebook</h2>
            </div>
            
            <div className="space-y-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="border-l-4 border-blue-500 pl-4 py-1"
              >
                <h3 className="text-lg font-semibold text-white">Today's Goals</h3>
                <ul className="text-gray-400 list-disc list-inside space-y-1 mt-2">
                  <li>Complete project proposal</li>
                  <li>Research new design trends</li>
                  <li>Schedule team meeting</li>
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
                className="border-l-4 border-purple-500 pl-4 py-1"
              >
                <h3 className="text-lg font-semibold text-white">Creative Ideas</h3>
                <p className="text-gray-400 mt-2">
                  What if we created an interactive onboarding flow that adapts to each user's learning style?
                </p>
              </motion.div>
              
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
                className="border-l-4 border-green-500 pl-4 py-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Meeting Notes</span>
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Project-X</span>
                </div>
                <p className="text-gray-400 mt-2">
                  <strong>Action Items:</strong> @Alex to prototype new dashboard, @Sam to research analytics APIs
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to capture, organize, and share your best ideas
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-xl p-6 transition-all"
            >
              <motion.div
                animate={feature.animation}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-30"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Organize Your Thoughts?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Join thousands of creators, thinkers, and doers who trust our platform to keep their ideas safe and organized.
            </p>
            <div className="flex justify-center gap-4">
              <Link href={'/login'} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5" /> Start Your Notebook
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}