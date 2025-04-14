"use client";
import { siteNavigationArr } from "@/constants/websiteData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const Footer = () => {
  const pathName = usePathname();
  const middleIndex = Math.floor(siteNavigationArr.length / 2);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-gray-700 backdrop-blur-sm sm:hidden max-sm:block z-50">
      <div className="flex justify-around items-end py-2 px-4">
        {siteNavigationArr.map((item, index) => {
          const isActive = pathName === item.href;
          const isMiddle = index === middleIndex;
          
          return (
            <Link 
              key={index} 
              href={item.href} 
              className="text-center relative"
            >
              <motion.div
                className={`flex flex-col items-center ${
                  isActive ? 'text-green-400' : 'text-gray-400'
                }`}
                whileTap={{ scale: 0.9 }}
                initial={false}
                animate={{
                  y: isActive ? -5 : 0,
                  scale: isMiddle ? 1.1 : 1
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Active indicator dot */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      className="absolute top-0 h-1 w-1 rounded-full bg-green-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon container with pulse animation when active */}
                <motion.div
                  className={`p-2 rounded-full ${
                    isActive ? 'bg-green-400/20' : ''
                  }`}
                  animate={{
                    scale: isMiddle ? 1.15 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`${
                      isMiddle ? 'size-8' : 'size-6'
                    } transition-all duration-300`}
                  >
                    {item.svgPath}
                  </svg>
                </motion.div>

                {/* Label with subtle animation */}
                <motion.p 
                  className={`text-xs mt-1 ${
                    isActive ? 'font-medium' : 'font-normal'
                  }`}
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
    </div>
  );
};

export default Footer;