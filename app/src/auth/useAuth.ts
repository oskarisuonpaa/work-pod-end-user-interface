import { useContext } from "react";
import { AuthContext } from "./AuthContext.ts";
import type { AuthContextType } from "./types";

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
