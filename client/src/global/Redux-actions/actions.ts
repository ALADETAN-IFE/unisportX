import { createSlice } from "@reduxjs/toolkit";
import type { UserData, Role } from '../../interface';

const initialState = {
    userData: null as UserData | null,
    isLoggedIn: false,
    role: null as Role | null 
}


export const uniSportXSlice = createSlice({
    name: "uniSportX",
    initialState,
    reducers: {
        setUserData: (state,  action: { payload: UserData }) => {
            state.userData = action.payload; 
            state.role = action.payload?.role;
        },
        logIn: (state) => {
            state.isLoggedIn = true;
        },
        logOut: (state) => {
            state.isLoggedIn = false;
            state.userData = null; 
            state.role = null; 
        },

    }
});

export const { setUserData, logIn, logOut } = uniSportXSlice.actions;
export default uniSportXSlice.reducer;




