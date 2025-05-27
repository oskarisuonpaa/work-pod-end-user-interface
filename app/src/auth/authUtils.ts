import { jwtDecode } from "jwt-decode";
import type { JWTPayload, User } from "./types";

export const isTokenValid = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JWTPayload>(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getTokenExpirationDelay = (token: string): number => {
  try {
    const { exp } = jwtDecode<JWTPayload>(token);
    const delay = exp * 1000 - Date.now();
    return delay > 0 ? delay : 0;
  } catch {
    return 0;
  }
};

export const getUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return {
      name: decoded.name,
      email: decoded.email,
      ...decoded,
    };
  } catch {
    return null;
  }
};
