import { jwtDecode } from "jwt-decode";

type GoogleJwtPayload = {
  name: string;
  [key: string]: unknown;
};

/**
 * Extracts the user's name from a Google JWT token.
 * @param {string} token - The JWT token to decode.
 * @returns {string} The user's name or "User" if decoding fails.
 * @description This function attempts to decode a Google JWT token to extract the user's name.
 * If the token is invalid or does not contain a name, it returns "User".
 */
const getUserNameFromToken = (token: string): string => {
  try {
    const decoded = jwtDecode<GoogleJwtPayload>(token);
    return decoded.name || "User";
  } catch {
    return "User";
  }
};

export default getUserNameFromToken;
