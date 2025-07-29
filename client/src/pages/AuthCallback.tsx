// src/pages/AuthCallback.tsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import customAxios from '../api/axiosInstance.ts';
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login as reduxLogin } from '../utils/user';
// import debounce from '../utils/deBounce';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // const hash = window.location.hash.substring(1);
    // const params = new URLSearchParams(hash);
    // const idToken = params.get("id_token") || params.get("access_token");
    // Prevent multiple executions in React Strict Mode
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    
    const handleCallback = async () => {
      try {
        
      // console.log("hasProcessed 2", hasProcessed)
        // Get the access token from URL hash
        // Get the ID token from URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const idToken = params.get("id_token");
        const error = params.get("error");

        // if (idToken) {
        //     axios
        //       .post("http://localhost:3000/api/auth/google", { token: idToken })
        //       .then((res) => {
        //         // Save token or user info
        //         navigate("/");
        //       })
        //       .catch((err) => {
        //         console.error(err);
        //       });
        //   }
        // }, []);
        if (error) {
          toast.error("Google authentication failed. Please try again.");
          navigate("/login");
          return;
        }

        if (!idToken) {
          toast.error("No ID token received from Google.");
          navigate("/login");
          return;
        }
        // Send the access token to your backend
        // Send the ID token to your backend
        const response = await axios.post(
          `/auth/google`,
          { token: idToken }
        );

        if (response.data.success) {
          toast.success("Successfully signed in with Google!");
          reduxLogin(dispatch, response.data.data);
          navigate("/app");
        } else {
          toast.error(response.data.message || "Authentication failed");
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          {loading ? "Signing you in..." : "Redirecting..."}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;