import axios from 'axios';

export async function checkAuth() {
  try {
    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/check`, {}, {
      withCredentials: true,
    });
    return response.data.authenticated;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return false;
    }
    return false;
  }
}
