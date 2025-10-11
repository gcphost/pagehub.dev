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
    className="cursor-pointer rounded-md px-1 py-1.5 text-muted-foreground hover:text-accent-foreground"
    onClick={onClick}
  >
    {children}
  </motion.button>
);

export default MenuItem;
