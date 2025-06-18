import client from "./client";
import formatDate from "@utils/formatDate";
import type { WorkpodsResponse, CalendarEvent } from "types/workpods";

const API_ROUTES = {
  calendars: "/calendars",
  calendarEvents: (calendarId: string, timeMin: string, timeMax: string) =>
    `/events?calendarId=${calendarId}&timeMin=${timeMin}&timeMax=${timeMax}`,
} as const;

/**
 * Fetches all workpods (calendars).
 * @returns {Promise<WorkpodsResponse>} A promise that resolves to the workpods response.
 */
export const getWorkpods = async (): Promise<WorkpodsResponse> => {
  const response = await client.get<WorkpodsResponse>(API_ROUTES.calendars);
  return response.data;
};

/**
 * Fetches calendar events for a specific workpod.
 * @param {string} workpodId - The ID of the workpod (calendar).
 * @param {string} [timeMin] - The minimum time for the events (ISO string).
 * @param {string} [timeMax] - The maximum time for the events (ISO string).
 * @returns {Promise<CalendarEvent[]>} A promise that resolves to an array of calendar events.
 */
export const getWorkpodCalendar = async (
  workpodId: string,
  timeMin?: string,
  timeMax?: string
): Promise<CalendarEvent[]> => {
  if (!workpodId) {
    throw new Error("Missing required parameter: workpodId");
  }

  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(0, 0, 0);

  const base = timeMin ? new Date(timeMin) : now;
  timeMin = timeMin ?? formatDate(now);
  timeMax =
    timeMax ?? formatDate(new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000));

  const response = await client.get<CalendarEvent[]>(
    API_ROUTES.calendarEvents(workpodId, timeMin, timeMax)
  );

  return response.data;
};
