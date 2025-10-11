import { motion } from "framer-motion";

const MenuItem = ({ tooltip, onClick, children, animate = false }) => (
  <motion.button
    whileTap={animate ? { scale: 0.9 } : {}}
    className="cursor-pointer rounded-md px-1 py-0.5 hover:bg-primary hover:text-primary-foreground"
    onClick={onClick}
  >
    {children}
  </motion.button>
);

export default MenuItem;
