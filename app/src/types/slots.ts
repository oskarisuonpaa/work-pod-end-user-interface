export type SlotStatus = "free" | "booked";

export type SelectedSlot = {
  start: string;
  end: string;
  status: SlotStatus;
  title: string;
  eventId?: string;
};
