// "use client";

// import { useState, useRef } from 'react';
// import { motion } from 'framer-motion';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const RegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     dob: null,
//     image: null,
//     preview: null,
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setFormData(prev => ({
//         ...prev,
//         image: file,
//         preview: URL.createObjectURL(file),
//       }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     // Simulate API call
//     setTimeout(() => {
//       console.log('Form submitted:', formData);
//       setIsSubmitting(false);
//       // Reset form
//       setFormData({
//         name: '',
//         email: '',
//         password: '',
//         dob: null,
//         image: null,
//         preview: null,
//       });
//     }, 2000);
//   };

//   const handleGoogleLogin = () => {
//     // Implement Google login logic here
//     console.log('Google login clicked');
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md"
//       >
//         <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden p-8 border border-white border-opacity-20">
//           <motion.h2 
//             className="text-3xl font-bold text-center text-white mb-8"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//           >
//             Create Your Account
//           </motion.h2>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Profile Image Upload */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="flex justify-center"
//             >
//               <div 
//                 className="relative w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-white border-opacity-30 hover:border-opacity-50 transition-all"
//                 onClick={triggerFileInput}
//               >
//                 {formData.preview ? (
//                   <img 
//                     src={formData.preview} 
//                     alt="Preview" 
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="text-white text-opacity-70">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleImageChange}
//                   accept="image/*"
//                   className="hidden"
//                 />
//               </div>
//             </motion.div>

//             {/* Name Field */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//             >
//               <label htmlFor="name" className="block text-sm font-medium text-white text-opacity-80 mb-1">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all"
//                   placeholder="Enter your name"
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Email Field */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//             >
//               <label htmlFor="email" className="block text-sm font-medium text-white text-opacity-80 mb-1">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all"
//                   placeholder="Enter your email"
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Password Field */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6 }}
//             >
//               <label htmlFor="password" className="block text-sm font-medium text-white text-opacity-80 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all"
//                   placeholder="Create a password"
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Date of Birth Field */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//             >
//               <label htmlFor="dob" className="block text-sm font-medium text-white text-opacity-80 mb-1">
//                 Date of Birth
//               </label>
//               <div className="relative">
//                 <DatePicker
//                   selected={formData.dob}
//                   onChange={(date) => setFormData(prev => ({ ...prev, dob: date }))}
//                   dateFormat="MMMM d, yyyy"
//                   placeholderText="Select your birth date"
//                   className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all"
//                   required
//                   showYearDropdown
//                   dropdownMode="select"
//                   maxDate={new Date()}
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Submit Button */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.8 }}
//             >
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full py-3 px-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all transform hover:scale-105 active:scale-95"
//               >
//                 {isSubmitting ? (
//                   <div className="flex items-center justify-center">
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Creating Account...
//                   </div>
//                 ) : (
//                   'Create Account'
//                 )}
//               </button>
//             </motion.div>
//           </form>

//           {/* Divider with "OR" */}
//           <motion.div 
//             className="flex items-center my-6"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.9 }}
//           >
//             <div className="flex-grow border-t border-white border-opacity-30"></div>
//             <span className="mx-4 text-white text-opacity-70">OR</span>
//             <div className="flex-grow border-t border-white border-opacity-30"></div>
//           </motion.div>

//           {/* Google Login Button */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 1.0 }}
//           >
//             <button
//               onClick={handleGoogleLogin}
//               className="w-full py-3 px-4 bg-white bg-opacity-0 border border-white border-opacity-30 text-white font-medium rounded-lg shadow-sm hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
//             >
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.665 15.63 16.89 16.795 15.725 17.575V20.335H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
//                 <path d="M12 23C14.97 23 17.46 22.015 19.28 20.335L15.725 17.575C14.74 18.235 13.48 18.625 12 18.625C9.135 18.625 6.71 16.69 5.845 14.09H2.17V16.94C3.98 20.535 7.7 23 12 23Z" fill="#34A853"/>
//                 <path d="M5.845 14.09C5.625 13.43 5.5 12.725 5.5 12C5.5 11.275 5.625 10.57 5.845 9.91V7.06H2.17C1.4 8.59 1 10.245 1 12C1 13.755 1.4 15.41 2.17 16.94L5.845 14.09Z" fill="#FBBC05"/>
//                 <path d="M12 5.375C13.615 5.375 15.065 5.93 16.205 7.02L19.36 3.865C17.455 2.09 14.965 1 12 1C7.7 1 3.98 3.465 2.17 7.06L5.845 9.91C6.71 7.31 9.135 5.375 12 5.375Z" fill="#EA4335"/>
//               </svg>
//               Continue with Google
//             </button>
//           </motion.div>

//           {/* Login Link */}
//           <motion.div 
//             className="mt-6 text-center text-white text-opacity-70 text-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1.1 }}
//           >
//             Already have an account?{' '}
//             <a href="#" className="text-white font-medium hover:underline">
//               Sign in
//             </a>
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default RegistrationForm;