export type SlotStatus = "free" | "booked";

export type CalendarEvent = {
  id?: string;
  title: string;
  start: string | Date;
  end: string | Date;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    status: SlotStatus;
  };
};
