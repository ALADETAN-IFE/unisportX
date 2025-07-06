import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";
import ScrollToTopBtn from "../components/ScrollToTopBtn";


const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
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
