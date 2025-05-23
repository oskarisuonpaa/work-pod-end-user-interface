import { Navigate } from "react-router";
import { useAuth } from "../AuthProvider";
import { jwtDecode } from "jwt-decode";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

type JWTPayload = {
  exp: number;
};

const isTokenValid = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JWTPayload>(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token } = useAuth();

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
