import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import type { RootState } from '../global/Redux-Store/Store';
import { useEffect } from 'react';
import { scrollToTop } from '../utils/scrollToTop';
import ScrollToTopBtn from '../components/ScrollToTopBtn';
// import { toast } from 'react-toastify';

const PRroute = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.uniSportX);

  // Scroll to top when the route changes
  useEffect(() => {
    scrollToTop();
    // if (!isLoggedIn) {
    // // if (!isLoggedIn && hasToasted == "false") {
    //   toast.info('You have to log in to view this page'); 
    // }
  }, [location.pathname]);


  return isLoggedIn ? <><ScrollToTopBtn/> <Outlet/></> :  <Navigate to="/login" replace />
}

export default PRroute