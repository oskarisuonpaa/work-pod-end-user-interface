import type { EventInput } from "@fullcalendar/core";

// TEMP??
export type WorkpodWithEvents = {
  workpodId: string;
  isReserved: boolean;
  freeFor: number;
  freeUntil: Date | null;
  events: EventInput[];
  reservedUntil: Date | null;
  reservedFor: number;
};

export type DataItem = {
  description: string;
  end: string; // ISO date string
  id: string;
  start: string; // ISO date string
  title: string;
};

// TEMP?? END

export type Calendar = {
  alias: string;
  status: "free" | "busy" | "unknown";
};
