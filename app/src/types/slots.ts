export type SlotStatus = "free" | "booked";

export type CalendarEvent = {
  id?: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps: {
    status: SlotStatus;
  };
};
