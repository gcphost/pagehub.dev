import { motion } from "framer-motion";

export const MotionIcon = ({
  children,
  className = "flex items-center justify-center gap-1.5",
}) => (
  <motion.div
    whileTap={{ scale: 0.9 }}
    className={className}
    style={{
      willChange: "transform",
      backfaceVisibility: "hidden",
      WebkitFontSmoothing: "antialiased",
    }}
  >
    {children}
  </motion.div>
);

export const MotionInside = ({ children, className = "" }) => (
  <motion.div style={{ transformOrigin: "50% 50%" }} className={className}>
    {children}
  </motion.div>
);
