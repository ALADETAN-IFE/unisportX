import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../global/Redux-Store/Store';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  // const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { role } = useSelector((state: RootState) => state.uniSportX);

  setTimeout(() => {
    setTimeout(() => {
      // setIsAdmin(userData?.role === "admin")
      // setIsAdmin(role === "admin")
      console.log("role === 'admin'", role === "admin")
    }, 1000);
    setLoading(false)
  }, 2500);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking admin privileges...</p>
        </div>
      </div>
    );
  }

  if (role !== "admin") {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute; 