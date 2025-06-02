import type { EventInput } from "@fullcalendar/core/index.js";

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

export type WorkPod = {
    workpodId: string;
    isReserved: boolean;
    freeFor: number;
    freeUntil: Date | null;
    events: EventInput[];
    reservedUntil: Date | null;
    reservedFor: number;
}

export type  DataItem = {
  description: string;
  end: string;    // ISO date string
  id: string;
  start: string;  // ISO date string
  title: string;
}