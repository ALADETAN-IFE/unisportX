import { setUserData, logIn, logOut } from '../global/Redux-actions/actions';
import type { UserData } from '../interface';
import type { AppDispatch } from '../global/Redux-Store/Store';
import { store } from '../global/Redux-Store/Store';
import axios from 'axios';


export const login = (dispatch: AppDispatch, userData: UserData) => {
    dispatch(setUserData(userData));
    dispatch(logIn());
};

// Utility to force logout from anywhere
export const forceLogout = async () => {
    try {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {}, { withCredentials: true });
    } catch {
        // Optionally log error or ignore
    } finally {
        store.dispatch(logOut());
    }
    
    // Clear client-side cookies as well
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};