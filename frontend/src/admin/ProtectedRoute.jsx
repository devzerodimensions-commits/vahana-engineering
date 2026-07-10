import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Guards admin routes — redirects to the login page when not authenticated.
export default function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth();
  const location = useLocation();
  if (!isAuthed) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}
