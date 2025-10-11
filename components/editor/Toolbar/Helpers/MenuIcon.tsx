import { motion } from "framer-motion";

const MenuItem = ({ tooltip, onClick, children, animate = false }) => (
  <motion.button
    whileTap={animate ? { scale: 0.9 } : {}}
    className="cursor-pointer rounded-md px-1 py-1.5 text-muted-foreground hover:text-accent-foreground"
    onClick={onClick}
  >
    {children}
  </motion.button>
);

export default MenuItem;
