import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
export const StatCard = ({ icon, text, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.05, x: 10 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-full glass-effect p-3 flex items-center gap-2 text-left cursor-pointer"
    >
      <span className="text-[#FF6B35] text-2xl">{icon}</span>
      <p className="text-md text-white">{text}</p>
    </motion.div>
  );
};
