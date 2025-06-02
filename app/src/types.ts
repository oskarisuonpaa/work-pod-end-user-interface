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
