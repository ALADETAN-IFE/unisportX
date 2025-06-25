import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="container mx-auto text-center p-8">
      <motion.h1 
        className="text-5xl font-bold mb-4 text-gray-800 dark:text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Welcome to UniSportX
      </motion.h1>
      <motion.p 
        className="text-xl mb-8 text-gray-600 dark:text-gray-300"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        The ultimate platform for sharing and watching your university's sports highlights.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link to="/signup">
          <button className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300 mr-4">
            Get Started
          </button>
        </Link>
        <Link to="/login">
          <button className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition duration-300">
            Login
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;