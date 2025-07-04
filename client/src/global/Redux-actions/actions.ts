import { createSlice } from "@reduxjs/toolkit";
import type { UserData } from '../../interface';

const initialState = {
    userData: null as UserData | null,
    isLoggedIn: false,
}


export const uniSportXSlice = createSlice({
    name: "uniSportX",
    initialState,
    reducers: {
        setUserData: (state,  action: { payload: UserData }) => {
            state.userData = action.payload; 
        },
        logIn: (state) => {
            state.isLoggedIn = true;
        },
        logOut: (state) => {
            state.isLoggedIn = false;
            state.userData = null; 
        },

    }
});

export const { setUserData, logIn, logOut } = uniSportXSlice.actions;
export default uniSportXSlice.reducer;




