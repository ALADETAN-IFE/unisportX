import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import type { RootState } from '../global/Redux-Store/Store';

const PRroute = () => {
  const { isLoggedIn,  } = useSelector((state: RootState) => state.uniSportX);

  return isLoggedIn ? <Outlet/>  :  <Navigate to="/login" replace={true}/>
}

export default PRroute