// import axios from 'axios';

export async function checkAuth() {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/check`, {
    method: 'POST',
    credentials: 'include',
  });
  if (res.status === 401) return false;
  const data = await res.json();
  return data.authenticated;
}
