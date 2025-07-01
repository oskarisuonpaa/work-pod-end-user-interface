import { createContext } from "react";
import type { AuthContextType } from "./types";

/**
 * AuthContext provides authentication state and methods for login/logout.
 * @module AuthContext
 * @description This context is used to manage user authentication state across the application.
 */
export const AuthContext = createContext<AuthContextType>({
  token: "",
  user: null,
  isAuthenticated: () => false,
  onLogin: () => {},
  onLogout: () => {},
});
