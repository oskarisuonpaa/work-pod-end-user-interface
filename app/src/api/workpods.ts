import type {
  Calendar,
  CalendarEvent,
  GetCalendarsResponse,
  GetEventsResponse,
} from "@types";
import client from "./client";
import formatDate from "@utils/formatDate";
import { unwrapResponse } from "@utils/unwrapResponse";

const API_ROUTES = {
  calendars: "/calendars",
  calendarEvents: (calendarId: string, timeMin: string, timeMax: string) =>
    `/events?calendarId=${calendarId}&timeMin=${timeMin}&timeMax=${timeMax}`,
} as const;

/**
 * Fetches all workpods (calendars).
 * @returns {Promise<Calendar[]>} A promise that resolves to the workpods response.
 */
export const getWorkpods = async (): Promise<Calendar[]> => {
  const response = await client.get<GetCalendarsResponse>(API_ROUTES.calendars);

  return unwrapResponse(response.data);
};

/**
 * Fetches calendar events for a specific workpod.
 * @param {string} workpodId - The ID of the workpod (calendar).
 * @param {string} [timeMin] - The minimum time for the events to be fetched.
 * @param {string} [timeMax] - The maximum time for the events to be fetched.
 * @returns {Promise<CalendarEvent[]>} A promise that resolves to an array of calendar events.
 */
export const getWorkpodCalendar = async (
  workpodId: string,
  timeMin?: string,
  timeMax?: string
): Promise<CalendarEvent[]> => {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(0, 0, 0);

  const base = timeMin ? new Date(timeMin) : now;
  timeMin = timeMin ?? formatDate(now);
  timeMax =
    timeMax ?? formatDate(new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000));

  const response = await client.get<GetEventsResponse>(
    API_ROUTES.calendarEvents(workpodId, timeMin, timeMax)
  );

  const events = unwrapResponse(response.data);

  return events.map(
    (event): CalendarEvent => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start).toISOString(),
      end: new Date(event.end).toISOString(),
      backgroundColor: "var(--red)",
      borderColor: "var(--red)",
      extendedProps: {
        status: "booked",
      },
    })
  );
};
