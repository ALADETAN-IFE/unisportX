import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { login as reduxLogin } from '../utils/user';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';
import GoogleAuthBtn from '../components/GoogleAuthBtn';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = {
      username: username.charAt(0).toUpperCase() + username.slice(1).toLowerCase(),
      email,
      password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, formData , {
        withCredentials: true
      });

      if (response.data.message.includes('User registered successfully')) {
        toast.success("Account created successfully! Please check your email to verify your account.")
        setTimeout(() => {     
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.log(err)
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Signup failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Sign Up"
        description="Join UniSportX today! Create your account to share university sports highlights, connect with athletes and fans, and be part of the ultimate university sports community."
        keywords="sign up, register, university sports, sports platform, athletic community, student registration, join sports community"
        url="/signup"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Sign Up - UniSportX",
          "description": "Create your UniSportX account",
          "url": "https://unisport-x.vercel.app/signup"
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
          <h2 className="text-3xl font-semibold md:font-bold mb-6 text-center text-gray-800 dark:text-white">Create Account</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="max-sm:text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="max-sm:text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="flex items-center justify-between flex-col gap-4 md:flex-row">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            <Link to="/login" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Already have an account?
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
            text="Sign up with Google"
          />
        </form>
      </div>
    </motion.div>
    </>
  );
};

export default SignupPage; 