import { motion } from "framer-motion";

const AnimateWrap = ({
  children,
  keyValue,
  initial = { opacity: 0, scale: 0.8 },
  animate = { opacity: 1, scale: 1 },
  exit = { opacity: 0, scale: 0.8 },
  transition = { duration: 0.5, ease: "easeInOut" },
  className,
}) => {
  return (
    <motion.div
      key={keyValue}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      className={className}

    >
      {children}
    </motion.div>
  );
};

export default AnimateWrap;
