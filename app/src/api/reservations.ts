import type {
  DeleteReservationPayload,
  GetSingleReservationPayload,
  PostReservation,
  PostReservationPayload,
  ReservationInfo,
  UserReservation,
} from "types/reservations";
import apiClient from "./client";

const API_ROUTES = {
  book: "/book",
  cancel: (cid: string, eid: string) => `/cancel/${cid}/${eid}`,
  userEvents: "/user-events",
  booking: (cid: string, eid: string) => `/booking/${cid}/${eid}`,
} as const;

/**
 * Posts a reservation to the server.
 * @param {Object} params - The reservation details.
 * @param {string} params.calendarId - The ID of the calendar where the reservation is being made.
 * @param {string} params.start - The start time of the reservation in ISO 8601 format.
 * @param {string} params.end - The end time of the reservation in ISO 8601 format.
 * @throws {Error} Throws an error if any of the required parameters (`calendarId`, `start`, `end`) are missing.
 * @returns {Promise<PostReservation>} A promise that resolves to the posted reservation data.
 */
const postReservation = async ({
  calendarId,
  start,
  end,
}: PostReservationPayload): Promise<PostReservation> => {
  if (!calendarId || !start || !end) {
    throw new Error("Missing required reservation parameters.");
  }
  const response = await apiClient.post(API_ROUTES.book, {
    calendarId,
    start,
    end,
  });
  return response.data;
};

/**
 * Deletes a reservation from the calendar.
 * @param {Object} payload - The payload containing identifiers for the reservation.
 * @param {string} payload.calendarId - The ID of the calendar containing the reservation.
 * @param {string} payload.eventId - The ID of the event to be deleted.
 * @returns {Promise<void>} A promise that resolves when the reservation is successfully deleted.
 * @throws {Error} Throws an error if the deletion request fails.
 */
const deleteReservation = async ({
  calendarId,
  eventId,
}: DeleteReservationPayload): Promise<void> => {
  const response = await apiClient.delete(
    API_ROUTES.cancel(calendarId, eventId)
  );
  return response.data;
};

/**
 * Fetches the reservations for the current user.
 * @returns {Promise<UserReservation[]>} A promise that resolves to an array of user reservations.
 */
const getUserReservations = async (): Promise<UserReservation[]> => {
  const response = await apiClient.get(API_ROUTES.userEvents);
  return response.data;
};

/**
 * Fetches a single reservation by its calendar and event ID.
 * @param {Object} param0 - The parameters for fetching the reservation.
 * @param {string} param0.calendarId - The ID of the calendar containing the reservation.
 * @param {string} param0.eventId - The ID of the event to be fetched.
 * @returns {Promise<ReservationInfo>} A promise that resolves to the reservation information.
 */
const getSingleReservation = async ({
  calendarId,
  eventId,
}: GetSingleReservationPayload): Promise<ReservationInfo> => {
  const response = await apiClient.get(API_ROUTES.booking(calendarId, eventId));
  return response.data;
};

export const reservationApi = {
  postReservation,
  deleteReservation,
  getUserReservations,
  getSingleReservation,
};
