import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { FiWifi, FiWifiOff } from 'react-icons/fi';

const NetworkActivity = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [show, setShow] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShow(true);
      setTimeout(() => setShow(false), 3000); // Show for 3s when back online
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShow(true);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed bottom-6 flex justify-center w-full transform -translate-x-1/2 z-100`}
          // className={`fixed bottom-6 left-[37%] md:left-[46%] transform -translate-x-1/2 z-50 bg-black`}
        >
          <div
            className={`flex gap-2 items-center rounded-lg shadow max-w-max text-white text-sm font-medium px-3 py-2 ${isOnline ? 'bg-green-600' : 'bg-red-600'}`}
            // style={{ padding: '4px' }}
          >
            {isOnline ? <FiWifi/>  : <FiWifiOff/>}
            {isOnline ? `You are back online` : 'You are offline'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkActivity;