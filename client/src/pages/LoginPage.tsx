import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login as reduxLogin } from '../utils/user';
import { toast } from 'react-toastify';
import ResendVerification from '../components/ResendVerification';
import SEO from '../components/SEO';
import GoogleAuthBtn from '../components/GoogleAuthBtn';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  let expired = params.get('expired');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    expired = ""

    try {
      const formData = username ? { 
        username: username.toLowerCase(), 
        password 
      } : { email, password };
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/login`, formData, {
        withCredentials: true
      });

      if (response.data.message === 'User logged in successfully') {
        toast.success(`Welcome back ${response.data?.data?.username}`)
        setTimeout(() => {     
          reduxLogin(dispatch, response.data.data);
          navigate('/app');
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || 'Login failed';
        setError(errorMessage);
        
        // If user needs verification, show special message and resend option
        if (err.response?.data?.needsVerification) {
          setResendEmail(err.response?.data?.email)
          setError('Please verify your email address before logging in. Check your inbox for the verification link.');
          setShowResendVerification(true);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = () => {
    if (resendEmail) {
      setShowResendVerification(true);
    } else {
      setError('Please enter your email address to resend verification');
    }
  };

  return (
    <>
      <SEO 
        title="Login"
        description="Sign in to your UniSportX account to access university sports highlights, share your athletic moments, and connect with the university sports community."
        keywords="login, sign in, university sports, sports platform, athletic community, student login"
        url="/login"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Login - UniSportX",
          "description": "Sign in to your UniSportX account",
          "url": "https://unisport-x.vercel.app/login"
        }}
      />
      <motion.div 
        className="container mx-auto p-8 flex justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
            <h2 className="text-3xl font-semibold md:font-bold mb-6 text-center text-gray-800 dark:text-white">Login</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
                {error.includes('verify your email') && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="block mt-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Resend verification email
                  </button>
                )}
              </div>
            )}

            {expired && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">Login expired, please login again.</div>}

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                Username or Email
              </label>
              <input
                className="max-sm:text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username or Email"
                value={username || email}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.includes('@')) {
                    setEmail(value);
                    setUsername('');
                  } else {
                    setUsername(value);
                    setEmail('');
                  }
                }}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
              <input
                  className="max-sm:text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                id="password"
                  type={showPassword ? "text" : "password"}
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
                <button
                  type="button"
                  className="absolute top-1/2 right-0 pr-3 transform -translate-y-1/2 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={20} 
                     color='#374151'
                     />
                ) : (
                  <IoEyeOutline size={20} 
                   color='#374151'
                   />
                )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3 md:mb-4 flex-col gap-4 md:flex-row">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              <Link to="/signup" className="self-start md:self-auto inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Don't have an account?
              </Link>
            </div>
            
            <div className="text-center max-sm:flex max-sm:justify-end">
              <Link to="/forgot-password" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Forgot your password?
              </Link>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or</span>
              </div>
            </div>

            {/* Google Auth Button */}
            <GoogleAuthBtn 
              text="Sign in with Google"
            />
          </form>
        </div>
      </motion.div>

      {showResendVerification && (
        <ResendVerification
          email={resendEmail}
          onClose={() => setShowResendVerification(false)}
        />
      )}
    </>
  );
};

export default LoginPage; 