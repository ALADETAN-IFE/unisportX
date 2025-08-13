import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { FiWifi, FiWifiOff } from 'react-icons/fi';
// import { networkError, NetERR } from '../utils/networkErr';
import { useNetworkError } from '../utils/networkErr';

const NetworkActivity = () => {
  const { hasNetworkError } = useNetworkError();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [show, setShow] = useState(!navigator.onLine);
  // const { hasNetworkError, networkError } = useNetworkError();
  // Use hasNetworkError in your UI
  // Call networkError({ isError: true }) to set error
  
  useEffect(() => {
    if(hasNetworkError){
      setTimeout(() => setShow(true), 3000); // Show for 3s when it is a network error
      return
    }
  },[hasNetworkError])

  useEffect(() => {
    // console.log("hasNetworkError22",hasNetworkError)
    const handleOnline = () => {
      setIsOnline(true);
      // console.log("isOnline",isOnline)
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
      {(show || hasNetworkError) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 flex justify-center w-full transform -translate-x-1/2 z-1000"
          // className={`fixed bottom-6 left-[37%] md:left-[46%] transform -translate-x-1/2 z-50 bg-black`}
        >
          <div
            className={`flex gap-2 items-center rounded-lg shadow max-w-max text-white text-sm font-medium px-3 py-2 ${hasNetworkError ? 'bg-red-600' : isOnline ? 'bg-green-600' : 'bg-red-600'}`}
            // style={{ padding: '4px' }}
          >
            { hasNetworkError ? <FiWifiOff/> : isOnline ? <FiWifi/> : <FiWifiOff/> }

            { hasNetworkError ? "Network Error" : isOnline ? `You are back online` : 'You are offline' }
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkActivity;