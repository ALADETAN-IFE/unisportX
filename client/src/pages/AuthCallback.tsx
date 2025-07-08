// src/pages/AuthCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login as reduxLogin } from '../utils/user';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // const hash = window.location.hash.substring(1);
    // const params = new URLSearchParams(hash);
    // const idToken = params.get("id_token") || params.get("access_token");
    const handleCallback = async () => {
      try {
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
          `${import.meta.env.VITE_SERVER_URL}/auth/google`,
          { token: idToken },
          { withCredentials: true }
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