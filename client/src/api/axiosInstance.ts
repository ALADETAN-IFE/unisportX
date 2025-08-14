import axios from 'axios';
import { checkAuth } from '../utils/auth';
import { forceLogout } from '../utils/user';

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
    const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
      forceLogout();
    window.location.href = '/login?expired=1';
    throw new axios.Cancel('Session expired');
  }
  return config;
});

export default instance;
