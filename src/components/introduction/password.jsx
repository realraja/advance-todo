'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Key, RefreshCw, Copy, Check } from 'lucide-react';

export default function PasswordGeneratorGuide() {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    length: 16,
    uppercase: true,
    numbers: true,
    symbols: true
  });

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

  // Generate password on first render
  useState(() => {
    generatePassword();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-200">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Lock className="w-12 h-12 text-purple-400" />
          </motion.div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
          Secure Password Generator
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Create strong, random passwords to protect your online accounts
        </p>
      </div>

      {/* Interactive Generator */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-12 border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Key className="text-yellow-400" /> Try Our Generator
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Password Display */}
          <div>
            <div className="relative mb-6">
              <input
                type="text"
                value={password}
                readOnly
                className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <motion.button
                  onClick={generatePassword}
                  whileHover={{ rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 hover:text-blue-400 transition"
                  title="Generate new"
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 hover:text-purple-400 transition"
                  title="Copy password"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>

            <motion.button
              onClick={generatePassword}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition shadow-lg"
            >
              Generate New Password
            </motion.button>
          </div>

          {/* Options */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Length: {options.length}</label>
              <input
                type="range"
                min="8"
                max="32"
                value={options.length}
                onChange={(e) => setOptions({...options, length: parseInt(e.target.value)})}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>8</span>
                <span>32</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={(e) => setOptions({...options, uppercase: e.target.checked})}
                  className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                <span>Include Uppercase Letters (A-Z)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={(e) => setOptions({...options, numbers: e.target.checked})}
                  className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                <span>Include Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={(e) => setOptions({...options, symbols: e.target.checked})}
                  className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                <span>Include Symbols (!@#$%)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="text-green-400" /> Why Strong Passwords Matter
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Prevent unauthorized access to your accounts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Protect against brute force attacks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Reduce risk of identity theft</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Secure sensitive personal and financial data</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Lock className="text-blue-400" /> Password Security Tips
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Use at least 12 characters (16+ recommended)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Combine letters, numbers, and symbols</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Avoid dictionary words and personal information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Use a unique password for each account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Consider using a password manager</span>
            </li>
          </ul>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-12 border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6">How Our Password Generator Works</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <div className="text-purple-400 mb-2 font-medium">1. Cryptographically Secure</div>
            <p className="text-sm text-gray-400">
              Uses browser's built-in cryptographic functions to ensure truly random password generation.
            </p>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <div className="text-purple-400 mb-2 font-medium">2. Customizable Options</div>
            <p className="text-sm text-gray-400">
              Adjust length and character types to meet different website requirements.
            </p>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <div className="text-purple-400 mb-2 font-medium">3. Client-Side Only</div>
            <p className="text-sm text-gray-400">
              Passwords are generated in your browser and never sent to our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Password Strength Meter Info */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6">Understanding Password Strength</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-24 text-right text-red-400 font-medium">Weak</div>
            <div className="flex-1 h-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full"></div>
            <div className="text-sm text-gray-400 w-32">Less than 8 chars</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 text-right text-yellow-400 font-medium">Moderate</div>
            <div className="flex-1 h-2 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full"></div>
            <div className="text-sm text-gray-400 w-32">8-12 chars, basic</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 text-right text-green-400 font-medium">Strong</div>
            <div className="flex-1 h-2 bg-gradient-to-r from-yellow-300 to-green-400 rounded-full"></div>
            <div className="text-sm text-gray-400 w-32">12-16 chars, mixed</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 text-right text-blue-400 font-medium">Very Strong</div>
            <div className="flex-1 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
            <div className="text-sm text-gray-400 w-32">16+ chars, complex</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-900/30 rounded-lg border border-purple-500/30">
          <h3 className="font-medium text-purple-400 mb-2">Pro Tip</h3>
          <p className="text-sm">
            The best passwords are long, random, and unique. Consider using passphrases (multiple random words)
            when allowed, as they're easier to remember but still very secure.
          </p>
        </div>
      </div>
    </div>
  );
}