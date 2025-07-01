import apiClient from "./client";
import type {
  DeleteReservationPayload,
  GetUserEventsResponse,
  PostReservationPayload,
  UserReservation,
} from "@types";
import { unwrapResponse } from "@utils/unwrapResponse";

const API_ROUTES = {
  book: "/book",
  cancel: (cid: string, eid: string) => `/cancel/${cid}/${eid}`,
  userEvents: "/user-events",
  booking: (cid: string, eid: string) => `/booking/${cid}/${eid}`,
} as const;

/**
 * Posts a reservation for a specific calendar.
 * @param {PostReservationPayload} payload - The payload containing calendar ID, start time, and end time.
 * @returns {Promise<null>} - Returns null if the reservation is successful.
 * @throws {Error} - Throws an error if required parameters are missing.
 */
const postReservation = async ({
  calendarId,
  start,
  end,
}: PostReservationPayload): Promise<null> => {
  if (!calendarId || !start || !end) {
    throw new Error("Missing required reservation parameters.");
  }
  const response = await apiClient.post("/book", {
    calendarId,
    start,
    end,
  });

  return unwrapResponse<null>(response.data);
};

/**
 * Deletes a reservation for a specific calendar and reservation ID.
 * @param {DeleteReservationPayload} payload - The payload containing calendar ID and reservation ID.
 * @returns {Promise<null>} - Returns null if the deletion is successful.
 * @throws {Error} - Throws an error if required parameters are missing.
 */
const deleteReservation = async ({
  calendarId,
  reservationId,
}: DeleteReservationPayload): Promise<null> => {
  const response = await apiClient.delete(
    API_ROUTES.cancel(calendarId, reservationId)
  );

  return unwrapResponse<null>(response.data);
};

/**
 * Retrieves user reservations.
 * @returns {Promise<UserReservation[]>} - Returns a list of user reservations.
 * @throws {Error} - Throws an error if the request fails.
 */
const getUserReservations = async (): Promise<UserReservation[]> => {
  const response = await apiClient.get<GetUserEventsResponse>(
    API_ROUTES.userEvents
  );
  return unwrapResponse<UserReservation[]>(response.data);
};

/**
 * API for managing reservations.
 * @module reservationApi
 * @description This module provides functions to post, delete, and get user reservations.
 */
export const reservationApi = {
  postReservation,
  deleteReservation,
  getUserReservations,
};
