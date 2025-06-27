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

const deleteReservation = async ({
  calendarId,
  reservationId,
}: DeleteReservationPayload): Promise<null> => {
  const response = await apiClient.delete(
    API_ROUTES.cancel(calendarId, reservationId)
  );

  return unwrapResponse<null>(response.data);
};

const getUserReservations = async (): Promise<UserReservation[]> => {
  const response = await apiClient.get<GetUserEventsResponse>(
    API_ROUTES.userEvents
  );
  return unwrapResponse<UserReservation[]>(response.data);
};

export const reservationApi = {
  postReservation,
  deleteReservation,
  getUserReservations,
};
