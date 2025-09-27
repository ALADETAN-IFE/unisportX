import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import customAxios from '../api/axiosInstance.ts';
// import { motion } from 'framer-motion';
import { motion } from 'motion/react';
// import { useSelector, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import type { RootState } from '../global/Redux-Store/Store';
import { Feed, Video } from '../assets/Icon';
import { scrollToTop } from '../utils/scrollToTop';
// import { logOut } from '../global/Redux-actions/actions';
import LogoutConfirm from './LogoutConfirm';
import { toast } from 'react-toastify';
import { forceLogout } from '../utils/user';

interface ModeProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Header = ({darkMode, setDarkMode}: ModeProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setisLoggingOut] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  // const dispatch = useDispatch();
  const { isLoggedIn, userData, role } = useSelector((state: RootState) => state.uniSportX);

  // Initialize dark mode from localStorage and system preference
  useEffect(() => {
    // setIsAdmin(role === "admin")
    const savedDarkMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);


  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  // const getToken = () => {
  //   const cookies = document.cookie.split('; ');
  //   const tokenCookie = cookies.find(cookie => cookie.startsWith("token="));
  //   return tokenCookie ? tokenCookie.split('=')[1] : `null ${cookies} hello ${document.cookie}`;
  // }
  
  // const token = getToken();
  // if (token) {
  //   console.log('Token is available:', token);
  // } else {
  //   console.log('Token is not available', token);
  // }

  const handleLogout = async () => {
    try {
      setisLoggingOut(true)
      // await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {});
      await forceLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // dispatch(logOut());
      setMobileMenuOpen(false);
      setShowLogoutConfirm(false);
      toast.success("You have logged out successfully")
      setisLoggingOut(false)
    }
  };

  const closeLogoutConfirm = () => {
    setShowLogoutConfirm(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 relative">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to={isLoggedIn ? "/app" : "/"} className="flex items-center space-x-2">
            <img src="/logo.png" alt="UniSportX" className="w-10 h-10" />
            <span className={`text-xl font-bold text-gray-800 dark:text-white hidden sm:block ${role == "admin" ? "min-md:!hidden" : "" }`}>
              UniSportX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Welcome, {userData?.username.charAt(0).toUpperCase()}{userData?.username.slice(1)}
                </span>
                {location.pathname !== '/app/videos' && (
                  <Link 
                    to="/app/videos"
                    className="flex gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm"
                  >
                   <Video />
                    Videos
                  </Link>
                )}
                {(location.pathname !== '/app') && (
                // {(location.pathname == '/app/videos' || location.pathname == '/app/manage' || location.pathname == '/') && (
                  <Link 
                    to="/app"
                    className="flex gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm"
                  >
                     <Feed />
                    Feed
                  </Link>
                )}
                {role === "admin" && location.pathname !== '/app/manage' && (
                  <Link 
                    to="/app/manage"
                    className="flex items-center gap-1 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-200 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin
                  </Link>
                )}
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Dark Mode Toggle for Mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <motion.div 
            className="bg-white dark:bg-gray-900 md:hidden mt-3 pb-4 border-t border-gray-200 dark:border-gray-700 absolute w-full overflow-hidden right-0 px-4"
            initial={{ opacity: 0, y: -500 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col space-y-3 pt-4">
              {isLoggedIn ? (
                <>
                  <span className="text-gray-700 dark:text-gray-300 text-sm px-2">
                    Welcome,  {userData?.username.charAt(0).toUpperCase()}{userData?.username.slice(1)}
                  </span>
                  {location.pathname !== '/app/videos' && (
                    <Link 
                      to="/app/videos"
                      className="flex gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                       <Video />
                      Videos
                    </Link>
                  )}
                  {location.pathname !== '/app' && (
                    <Link 
                      to="/app"
                      className="flex gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                       <Feed />
                      Feed
                    </Link>
                  )}
                  {role === "admin" && location.pathname !== '/app/manage' && (
                    <Link 
                      to="/app/manage"
                      className="flex gap-1 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-200 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={confirmLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 text-sm text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>
      
      {/* Logout Confirmation Dialog */}
      <LogoutConfirm
        isOpen={showLogoutConfirm}
        onClose={closeLogoutConfirm}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </header>
  );
};

export default Header; 
