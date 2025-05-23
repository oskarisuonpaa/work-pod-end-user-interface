import { useNavigate } from "react-router";
import { useState, createContext, useContext, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

const useAuth = () => useContext(AuthContext);

const AuthContext = createContext<{
  token: string;
  onLogin: (googleToken: string) => void;
  onLogout: () => void;
}>({
  token: "",
  onLogin: () => {},
  onLogout: () => {},
});

type AuthProviderProps = {
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

const getTokenExpirationDelay = (token: string): number => {
  try {
    const { exp } = jwtDecode<JWTPayload>(token);
    const delay = exp * 1000 - Date.now();
    return delay > 0 ? delay : 0;
  } catch {
    return 0;
  }
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("authToken") || "";
    return isTokenValid(stored) ? stored : "";
  });

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("authToken");
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    navigate("/login");
  };

  const handleLogin = (googleToken: string) => {
    if (isTokenValid(googleToken)) {
      setToken(googleToken);
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
    if (token) {
      const delay = getTokenExpirationDelay(token);
      logoutTimerRef.current = setTimeout(handleLogout, delay);
    }
  }, [token]);

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext, useAuth };
