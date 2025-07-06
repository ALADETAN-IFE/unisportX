import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import axios from 'axios';
import { features, testimonials } from "../utils/datas"
import Footer from '../components/Footer';

interface IVideo {
  _id: string;
  title: string;
  faculty: string;
  description: string;
  youtubeLink: string;
}

const Home = () => {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Refs for intersection observer
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const videosRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);

  // Check if elements are in view
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const videosInView = useInView(videosRef, { once: true, amount: 0.3 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!userData);

    // Fetch videos (only 3 for non-logged in users)
    const fetchVideos = async () => {
      try {
        setLoadingVideos(true)
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/videos/get-videos`);
        const allVideos = res.data;
        // Show only 3 videos for non-logged in users
        setVideos(isLoggedIn ? allVideos : allVideos.slice(0, 3));
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally{
        setLoadingVideos(false)
      }
    };
    fetchVideos();
  }, [isLoggedIn]);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdWithParams = url.split('v=')[1];
    const videoId = videoIdWithParams ? videoIdWithParams.split('&')[0] : '';
    return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          ref={heroRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-6xl font-bold mb-6 text-gray-800 dark:text-white">
            Welcome to <span className="text-blue-600 dark:text-blue-400">UniSportX</span>
          </h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The ultimate platform for sharing and watching your university's sports highlights and moments. Whether you're an athlete, a fan, or just part of the university community, join in to connect, celebrate victories, and enjoy the action together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/signup">
              <button className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full hover:bg-blue-700 transition duration-300 text-lg">
                Get Started Free
          </button>
        </Link>
        <Link to="/login">
              <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-full hover:bg-gray-50 transition duration-300 text-lg border-2 border-blue-600">
                Sign In
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          ref={featuresRef}
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Why Choose UniSportX?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video Preview Section */}
        <motion.div 
          ref={videosRef}
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={videosInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Latest Sports Highlights
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {isLoggedIn ? "Check out the latest videos from our community" : "Preview our latest videos (Sign up to see more!)"}
            </p>
          </div>
          {
            loadingVideos ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="text-4xl mb-4">🎥</div>
                  <p className="text-gray-600 dark:text-gray-400">Loading videos...</p>
                </motion.div>
              </div>
            ) : (
              <>
                {videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, index) => (
                      <motion.div
                        key={video._id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={videosInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      >
                        <iframe
                          width="100%"
                          height="200"
                          src={getYouTubeEmbedUrl(video.youtubeLink)}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full"
                        />
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{video.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400">Faculty: {video.faculty}</p>
                          <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">{video.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-3">No videos available yet. Be the first to upload!</p>
                    <Link to="/signup">
                    <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300">
                      Join UnisportX to Upload a Video
                    </button>
              </Link>
                  </div>
                )}
              </>
            )
          }
          
          
          {!isLoggedIn && videos.length > 0 && (
            <div className="text-center mt-8">
              <Link to="/signup">
                <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300">
                  Sign Up to See More Videos
                </button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Testimonials Section */}
        <motion.div 
          ref={testimonialsRef}
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">{testimonial.name}</p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          ref={ctaRef}
          className="text-center bg-blue-600 dark:bg-blue-700 rounded-2xl p-12 text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Join the Community?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start sharing your sports highlights and connect with fellow athletes today!
          </p>
          <Link to="/signup">
            <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition duration-300 text-lg">
              Create Your Account
          </button>
        </Link>
      </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;