export type BookedEvent = {
  id: string;
  start: Date;
  end: Date;
  [key: string]: unknown;
};
