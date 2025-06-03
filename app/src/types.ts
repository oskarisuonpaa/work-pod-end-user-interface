import type { EventInput } from "@fullcalendar/core";

export type BookedEvent = {
  id: string;
  start: Date;
  end: Date;
  [key: string]: unknown;
};

export type SelectedSlot = {
  start: string;
  end: string;
  status: SlotStatus;
  title: string;
  eventId?: string;
};

export type SlotStatus = "free" | "booked";

export type ReservationSlot = { start: string; end: string };

export type ReservationType = {
  id: string;
  start: string;
  end: string;
  calendarId: string;
};

export type Workpod = {
  alias: string;
  status: Availability;
};

const Availability = {
  Free: "free",
  Busy: "busy",
  Unknown: "unknown",
} as const;

export type Availability = (typeof Availability)[keyof typeof Availability];

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
