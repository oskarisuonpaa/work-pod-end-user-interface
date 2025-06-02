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
