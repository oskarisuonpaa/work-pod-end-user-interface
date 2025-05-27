import {
  createContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import {
  isTokenValid,
  getTokenExpirationDelay,
  getUserFromToken,
} from "./authUtils";
import type { AuthContextType, User } from "./types";

export const AuthContext = createContext<AuthContextType>({
  token: "",
  user: null,
  isAuthenticated: () => false,
  onLogin: () => {},
  onLogout: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("authToken") || "";
    return isTokenValid(stored) ? stored : "";
  });

  const [user, setUser] = useState<User | null>(() =>
    isTokenValid(token) ? getUserFromToken(token) : null
  );

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("authToken");
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    navigate("/login");
  };

  const handleLogin = (googleToken: string) => {
    if (isTokenValid(googleToken)) {
      setToken(googleToken);
      setUser(getUserFromToken(googleToken));
      localStorage.setItem("authToken", googleToken);
      const delay = getTokenExpirationDelay(googleToken);
      logoutTimerRef.current = setTimeout(handleLogout, delay);
      navigate("/dashboard");
    } else {
      console.error("Invalid or expired token");
    }
  };

  useEffect(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (token && isTokenValid(token)) {
      const delay = getTokenExpirationDelay(token);
      logoutTimerRef.current = setTimeout(handleLogout, delay);
      setUser(getUserFromToken(token));
    } else {
      setUser(null);
    }
  }, [token]);

  const value: AuthContextType = {
    token,
    user,
    isAuthenticated: () => isTokenValid(token),
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
