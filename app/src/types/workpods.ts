export type BookedEvent = {
  id: string;
  start: Date;
  end: Date;
  [key: string]: unknown;
};

const Availability = {
  Free: "free",
  Busy: "busy",
  Unknown: "unknown",
} as const;

export type Availability = (typeof Availability)[keyof typeof Availability];

export type Workpod = {
  alias: string;
  status: Availability;
};

export { Availability };
