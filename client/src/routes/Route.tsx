import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import Layout from "../layout/Layout";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import VideosPage from "../pages/VideosPage";
import FeedPage from "../pages/FeedPage";
import AdminPage from "../pages/AdminPage";
import PRroute from "../layout/PrivateRouting";
import AdminRoute from "../layout/AdminRoute";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";
import AuthCallback from "../pages/AuthCallback";
import PostPage from "../pages/PostPage";
// import UniSelect from "../components/UniSelect";



const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "auth/callback",
        element: <AuthCallback />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "verify-email/:token",
        element: <VerifyEmailPage />,
      },
      {
        path: "privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms",
        element: <TermsAndConditions />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
      // {
      //   path: "uniselect",
      //   element: <UniSelect />,
      // },
      {
        path: "app/:postId",
        element: <PostPage />,
      },
      {
        path: "app",
        element: <PRroute />,
        children: [
          {
            // path: "feed",
            index: true,
            element: <FeedPage />,
          },
          {
            path: "videos",
            element: <VideosPage />,
          },
          {
            path: "manage",
            element: <AdminRoute>
                       <AdminPage />
                    </AdminRoute>,
          },
        ]
      },
    ],
  },
]);

export default Routes;
