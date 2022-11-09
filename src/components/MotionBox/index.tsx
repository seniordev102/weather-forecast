import { motion } from "framer-motion";

export const MotionBox = ({ children, ...rest }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
