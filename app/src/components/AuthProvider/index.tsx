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
  const [token, setToken] = useState("");

  const handleLogin = async (googleToken: string) => {
    setToken(googleToken);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setToken("");
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext, useAuth };
