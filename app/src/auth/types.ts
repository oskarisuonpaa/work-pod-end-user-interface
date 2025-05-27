export type JWTPayload = {
  exp: number;
  name?: string;
  email?: string;
  [key: string]: any;
};

export type User = {
  name?: string;
  email?: string;
  [key: string]: any;
};

export type AuthContextType = {
  token: string;
  user: User | null;
  isAuthenticated: () => boolean;
  onLogin: (googleToken: string) => void;
  onLogout: () => void;
};
