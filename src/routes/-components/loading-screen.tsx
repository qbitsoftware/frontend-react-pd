import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center min-h-screen  ">
      <motion.div
        className="w-12 h-12 border-4 border-gray-300  border-t-gray-900  rounded-full animate-spin"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

export default LoadingScreen;
