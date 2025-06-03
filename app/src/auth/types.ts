export type JWTPayload = {
  exp: number;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

export type User = {
  name?: string;
  email?: string;
  [key: string]: unknown;
};

export type AuthContextType = {
  token: string;
  user: User | null;
  isAuthenticated: () => boolean;
  onLogin: (googleToken: string) => void;
  onLogout: () => void;
};
