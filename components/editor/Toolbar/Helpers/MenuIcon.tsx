import { motion } from "framer-motion";

const MenuItem = ({ tooltip, onClick, children, animate = false }) => (
  <motion.button
    whileHover={
      animate
        ? {
            scale: 1.3,
            transition: { duration: 0.2 },
          }
        : {}
    }
    whileTap={animate ? { scale: 0.9 } : {}}
    className="cursor-pointer text-gray-400 hover:text-white  rounded-md py-3 px-1"
    onClick={onClick}
  >
    {children}
  </motion.button>
);

export default MenuItem;
