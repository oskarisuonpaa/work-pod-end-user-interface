import { useNavigate } from "react-router";
import { useState, createContext, useContext } from "react";

const useAuth = () => {
  return useContext(AuthContext);
};

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

const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(
    () => localStorage.getItem("authToken") || ""
  );

  const handleLogin = (googleToken: string) => {
    setToken(googleToken);
    localStorage.setItem("authToken", googleToken);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("authToken");
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext, useAuth };
