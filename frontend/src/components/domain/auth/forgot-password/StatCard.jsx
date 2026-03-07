import React, { useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { animate, motion, useInView } from "motion/react";

export const StatCard = ({ label, value }) => {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const numericValue = parseInt(value.toString().replace(/[^0-9]/g, "")) || 0;

    const suffix = value.toString().replace(/[0-9,.]/g, "");

    const controls = animate(0, numericValue, {
      duration: 1,
      onUpdate: (latest) => {
        if (nodeRef.current) {
          nodeRef.current.textContent =
            Math.round(latest).toLocaleString() + suffix;
        }
      },
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <motion.div
      className="rounded-full glass-effect p-6 text-left"
      whileHover={{ scale: 1.05, x: 10 }}
      whileTap={{ scale: 0.98 }}
    >
      <p className="text-sm opacity-80 mb-1">{label}</p>
      <p ref={nodeRef} className="text-3xl font-bold">
        0+
      </p>
    </motion.div>
  );
};
