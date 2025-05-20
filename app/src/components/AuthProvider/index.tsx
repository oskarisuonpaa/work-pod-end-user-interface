// AuthProvider, AuthContext, useAuth
import { useNavigate } from "react-router";

/* usage example
    const { token, onLogout } = useAuth();
*   in return statement to show element conditionally:
    {token && (
    <button type="button" onClick={onLogout}>
     Sign Out
    </button>
    )}
*   onLogin example:
    const { onLogin } = useAuth();
    <button type="button" onClick={onLogin}>
      Sign In
    </button>
*/
import { useState, createContext, useContext } from "react";
import fakeAuth from "./authenticate.ts"; // TODO: replace fakeAuth

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContext = createContext<{
  token: string;
  onLogin: () => void;
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

  const handleLogin = async () => {
    const token = await fakeAuth(); // TODO: replace fakeAuth
    setToken(token);
    navigate("/dashboard"); // send user to dashboard on login
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
