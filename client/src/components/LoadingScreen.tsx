import { motion } from 'motion/react';

const LoadingScreen = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-4"
            >
              <img src="/logo.png" alt="UniSportX" className="w-24 h-24 mx-auto" />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              UniSportX
            </motion.h1>
            <motion.p 
              className="text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Loading your sports experience...
            </motion.p>
          </div>
        </div>
      );
}

export default LoadingScreen