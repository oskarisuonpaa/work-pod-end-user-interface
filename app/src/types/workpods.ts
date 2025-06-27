export type Workpod = {
  alias: string;
  status: "free" | "busy" | "unknown";
};

export type WorkpodsResponse = {
  calendars: Workpod[];
};
