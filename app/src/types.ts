export type BookedEvent = {
  id: string;
  start: Date;
  end: Date;
  [key: string]: unknown;
};

export type SelectedSlot = {
  start: string;
  end: string;
  status: string;
  title: string;
  eventId?: string;
};

export type SlotStatus = "free" | "booked";

export type SlotSelect = {
  start: string;
  end: string;
  status: SlotStatus;
  title: string;
  eventId?: string;
};

export type ReservationSlot = { start: string; end: string };
