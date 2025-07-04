import { setUserData, logIn } from '../global/Redux-actions/actions';
import type { UserData } from '../interface';
import type { AppDispatch } from '../global/Redux-Store/Store';


export const login = (dispatch: AppDispatch, userData: UserData) => {
    dispatch(setUserData(userData));
    dispatch(logIn());
};