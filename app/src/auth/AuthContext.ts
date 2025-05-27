import { createContext } from "react";
import type { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType>({
  token: "",
  user: null,
  isAuthenticated: () => false,
  onLogin: () => {},
  onLogout: () => {},
});
