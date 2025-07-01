import { Navigate } from "react-router";
import { useAuth } from "@auth/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

/**
 * ProtectedRoute component checks if the user is authenticated.
 * If not authenticated, it redirects to the login page.
 * @component
 * @param {ProtectedRouteProps} props - The component props containing children to render if authenticated.
 * @returns {JSX.Element} The rendered children if authenticated, otherwise a redirect to the login page.
 * @description This component is used to protect routes that require authentication.
 * It checks the authentication status using the `useAuth` hook and redirects to the login page
 * if the user is not authenticated.
 * The children prop contains the components to render if the user is authenticated.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
