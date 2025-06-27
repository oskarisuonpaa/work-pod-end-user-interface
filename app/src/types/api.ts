import type { Calendar } from "./calendar";
import type { Reservation, UserReservation } from "./reservation";

export type GenericResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; message: string };

// POST /book and DELETE /cancel
export type PostReservationResponse = GenericResponse<null>;
export type DeleteReservationResponse = GenericResponse<null>;

// GET endpoints
export type GetEventsResponse = GenericResponse<Reservation[]>;
export type GetCalendarsResponse = GenericResponse<Calendar[]>;
export type GetUserEventsResponse = GenericResponse<UserReservation[]>;

export type DeleteReservationPayload = {
  reservationId: string;
  calendarId: string;
};

export type PostReservationPayload = {
  calendarId: string;
  start: string;
  end: string;
};
