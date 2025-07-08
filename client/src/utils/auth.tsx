import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logOut } from "../global/Redux-actions/actions";

export function useAuth() {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/auth/check`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          toast.success("Please login again")
          dispatch(logOut());
        }
      });
  }, []);

  return user;
}
