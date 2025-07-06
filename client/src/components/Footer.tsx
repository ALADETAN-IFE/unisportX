import { Link } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollToTop';

const Footer = () => {
 
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 py-8 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center gap-2 mb-4 md:mb-0 md:items-start">
          <img src="/logo.png" className='max-w-full h-20 md:h-12'/>
          <span className="text-2xl font-bold text-blue-400">UniSportX</span>
        </div>
        {/* Navigation Links */}
        <nav className="flex flex-wrap gap-6 text-sm font-medium">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
          <Link to="/videos" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition">Videos</Link>
          <Link to="/feed" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition">Feed</Link>
          <span onClick={scrollToTop} className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer">About</span>
        </nav>
        {/* Tagline & Socials */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-300">For athletes, fans, and everyone in the university community.</span>
            {/* Social media icons as placeholders */}
          {/* <div className="flex gap-3 mt-1">
            <a href="#" className="hover:text-blue-400 transition" aria-label="Twitter"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.95 3.62-.72-.02-1.4-.22-1.99-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.11 2.94 3.97 2.97A8.6 8.6 0 0 1 2 19.54c-.28 0-.56-.02-.83-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 22.46 6z"/></svg></a>
            <a href="#" className="hover:text-blue-400 transition" aria-label="Instagram"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm6.13.88a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0z"/></svg></a>
            <a href="#" className="hover:text-blue-400 transition" aria-label="Facebook"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.525 8.998h-2.02V7.64c0-.465.308-.573.525-.573h1.465V4.998h-2.02c-2.22 0-2.72 1.66-2.72 2.72v1.28H9.5v2.5h1.755V19h2.25v-7.502h1.755l.265-2.5z"/></svg></a>
          </div> */}
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">&copy; {new Date().getFullYear()} UniSportX. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
