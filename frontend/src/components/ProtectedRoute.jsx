import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // 1. If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 2. Optional: role-based check
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" />; // You can create an Unauthorized page
  }

  // 3. If logged in (and role matches if required), render the child component
  return children;
};

export default ProtectedRoute;
