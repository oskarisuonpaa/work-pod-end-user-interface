export type ReservationType = {
  id: string;
  start: string;
  end: string;
  calendarId: string;
};

export type ReservationSlot = {
  start: string;
  end: string;
};

export type DeleteReservationPayload = {
  calendarId: string;
  reservationId: string;
};

export type UserReservation = {
  id: string;
  calendarId: string;
  title: string;
  start: string;
  end: string;
  description: string;
};

export type GetSingleReservationPayload = {
  calendarId: string;
  reservationId: string;
};

export type ReservationInfo = {
  name: string;
  room: string;
  date: string;
  start: string;
  end: string;
};

export type PostReservationPayload = {
  calendarId: string;
  start: string;
  end: string;
};

export type PostReservation = {
  success: boolean;
  link: string;
};
