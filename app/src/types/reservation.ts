export type Reservation = {
  id: string;
  title: string;
  start: string;
  end: string;
};

export type UserReservation = Reservation & { calendarId: string };
