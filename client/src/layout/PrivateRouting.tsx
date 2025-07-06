import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import type { RootState } from '../global/Redux-Store/Store';
import { useEffect } from 'react';
import { scrollToTop } from '../utils/scrollToTop';
import ScrollToTopBtn from '../components/ScrollToTopBtn';

const PRroute = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.uniSportX);

// Scroll to top when route changes
useEffect(() => {
  scrollToTop();
}, [location.pathname]);

  return isLoggedIn ? <><ScrollToTopBtn/> <Outlet/></> :  <Navigate to="/login" replace={true}/>
}

export default PRroute