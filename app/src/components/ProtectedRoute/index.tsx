// ProtectedRoute
import { Navigate } from 'react-router';
import { useAuth } from '../AuthProvider';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
export default ProtectedRoute