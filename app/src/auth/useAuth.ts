import { useContext } from "react";
import type { AuthContextType } from "./types";
import { AuthContext } from "./AuthContext.ts";

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
