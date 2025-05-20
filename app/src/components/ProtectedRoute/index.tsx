// ProtectedRoute
import { Navigate } from 'react-router';
import { useAuth } from '../AuthProvider';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token } = useAuth();
  console.log(token)

  if (!token) {
    console.log("no token")
    return <Navigate to="/" replace />;
  }

  return children;
};
export default ProtectedRoute