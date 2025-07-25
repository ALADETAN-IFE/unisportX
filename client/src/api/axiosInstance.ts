import axios from 'axios';
import { checkAuth } from '../utils/auth';
// import { logOut } from "../global/Redux-actions/actions";
// import { useDispatch } from "react-redux";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
    // const dispatch = useDispatch();
    const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
      // dispatch(logOut());
    window.location.href = '/login?expired=1';
    throw new axios.Cancel('Session expired');
  }
  return config;
});

export default instance;
