export type Workpod = {
  alias: string;
  status: "free" | "busy" | "unknown";
};

export type WorkpodsResponse = {
  calendars: Workpod[];
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  description: string;
};
