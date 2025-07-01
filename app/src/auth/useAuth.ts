import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./types";

/**
 * Custom hook to access authentication context.
 * @returns {AuthContextType} - The authentication context containing user and token information.
 */
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
