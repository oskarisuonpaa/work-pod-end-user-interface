import { useContext } from "react";
import type { AuthContextType } from "./types";
import { AuthContext } from "./AuthProvider";

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
