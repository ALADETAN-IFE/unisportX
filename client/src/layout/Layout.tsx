import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";
import ScrollToTopBtn from "../components/ScrollToTopBtn";
import { useSelector } from 'react-redux';
import type { RootState } from '../global/Redux-Store/Store';


const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const { isLoggedIn } = useSelector((state: RootState) => state.uniSportX);
   const navigate = useNavigate();

  const swithchIfLoggedIn = () => {
    // if loggedin redirect to "/app"
    if (isLoggedIn) {
      navigate("/app"); // redirect if logged in
    }
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      swithchIfLoggedIn()
    }, 2000);
    return () => clearTimeout(timer);
  }, []);


    if (isLoading) {
      return <LoadingScreen />
    }

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <Outlet />
      </main>
      <ScrollToTopBtn />
    </div>
  );
};

export default Layout;
