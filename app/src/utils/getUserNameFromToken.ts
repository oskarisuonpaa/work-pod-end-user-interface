import { jwtDecode } from "jwt-decode";

type GoogleJwtPayload = {
  name: string;
  [key: string]: unknown;
};

export function getUserNameFromToken(token: string): string {
  try {
    const decoded = jwtDecode<GoogleJwtPayload>(token);
    return decoded.name || "User";
  } catch {
    return "User";
  }
}
