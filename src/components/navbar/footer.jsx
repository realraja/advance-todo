"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { siteNavigationArr } from "@/constants/websiteData";

const Footer = () => {
  const pathname = usePathname();
  const middleIndex = Math.floor(siteNavigationArr.length / 2);

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed bottom-0 left-0 right-0 border-t border-gray-700 bg-black/95 backdrop-blur-sm z-50 sm:hidden"
    >
      <div className="relative flex justify-between items-center px-3 h-20">
        {siteNavigationArr.map((item, index) => {
          const isActive = pathname === item.href;
          const isMiddle = index === middleIndex;
          const Icon = item.icon;

          if (isMiddle) {
            return (
              <motion.div 
                key={index} 
                className="relative z-20 -mt-10 w-20 h-20"
                whileTap={{ scale: 0.9 }}
              >
                
                  <Link href={item.href}>
                    <motion.div
                      className={`rounded-full w-16 h-16 border flex  items-center justify-center shadow-lg ${
                        isActive 
                          ? "bg-indigo-500 border-indigo-400 shadow-red-500/30" 
                          : "bg-black border-gray-700"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      animate={{
                        y: isActive ? [-5, 0] : 0,
                        transition: { type: "spring", stiffness: 300 }
                      }}
                    >
                      <Icon
                        className={`w-7 h-7 ${
                          isActive ? "text-white" : "text-white"
                        }`}
                      />
                    </motion.div>
                  </Link>
                
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute top-0 left-0 right-0 flex justify-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="h-1 w-1 rounded-full bg-indigo-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.p 
                  className="text-xs mt-1"
                  animate={{
                    opacity: isActive ? 1 : 0.8,
                  }}
                >
                  {item.name}
                </motion.p>
              </motion.div>
            );
          }

          return (
            <Link key={index} href={item.href} className="w-full text-center">
              <motion.div
                className={`flex flex-col items-center ${
                  isActive ? "text-indigo-500" : "text-white"
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    y: isActive ? -5 : 0,
                  }}
                >
                  <Icon className="w-6 h-6" />
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        className="absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-red-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.p 
                  className="text-xs mt-1"
                  animate={{
                    opacity: isActive ? 1 : 0.8,
                  }}
                >
                  {item.name}
                </motion.p>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Animated curve cut-out effect */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-10 bg-black rounded-t-full z-10"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.2 }}
      />
    </motion.div>
  );
};

export default Footer;


const OldFooter = () => {
  const pathName = usePathname();
  const middleIndex = Math.floor(siteNavigationArr.length / 2);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-700 sm:hidden max-sm:block">
      <div className="relative flex justify-between items-center px-6 py-3">
        {oldSiteNavigationArr.map((item, index) => {
          const isActive = pathName === item.href;
          const isMiddle = index === middleIndex;

          if (isMiddle) {
            return (
              <div key={index} className="relative w-16 h-16 -mt-8 z-20">
                <Link href={item.href}>
                  <motion.div
                    className={`absolute inset-0 bg-black border-t-1 border-gray-500 rounded-full flex flex-col items-center justify-center text-white ${
                      isActive ? "text-indigo-500" : ""
                    }`}
                    whileTap={{ scale: 0.9 }}
                    animate={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-16"
                    >
                      {item.svgPath}
                    </svg>
                    <p className="text-xs mt-0.5">{item.name}</p>
                  </motion.div>
                </Link>
              </div>
            );
          }

          return (
            <Link key={index} href={item.href} className="flex-1 text-center">
              <motion.div
                className={`flex flex-col items-center justify-center ${
                  isActive ? "text-indigo-500" : "text-white"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  {item.svgPath}
                </svg>
                <p className="text-xs mt-1">{item.name}</p>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

