import { motion } from 'framer-motion';

export const MotionIcon = ({
  children,
  className = 'flex items-center justify-center gap-1.5',
}) => (
  <motion.div
    whileHover={{
      scale: 1.1,
      transition: { duration: 0.2 },
    }}
    whileTap={{ scale: 0.9 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const MotionInside = ({ children, className = '' }) => (
  <motion.div style={{ transformOrigin: '50% 50%' }} className={className}>
    {children}
  </motion.div>
);
