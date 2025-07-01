import { Navigate } from "react-router";
import { useAuth } from "@auth/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

/**
 * ProtectedRoute component checks if the user is authenticated.
 * If not authenticated, it redirects to the login page.
 * @param {ProtectedRouteProps} props - The component props containing children to render if authenticated.
 * @returns {JSX.Element} The rendered children if authenticated, otherwise a redirect to the login page.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
