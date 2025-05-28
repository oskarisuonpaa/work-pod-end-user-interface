import axios from "axios";

const formatDate = (date: Date) => {
  return date.toISOString();
};

export const getWorkpodCalendar = async (workpodId: string) => {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(0, 0, 0);
  const timeMin = formatDate(now);
  const timeMax = formatDate(
    new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  );

  const response = await axios.get(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/events?calendarId=${workpodId}&timeMin=${timeMin}&timeMax=${timeMax}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );

  return response.data;
};

export const getWorkpods = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/calendars`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );

  return response.data;
};

export const postReservation = async (
  workpodId: string,
  start: string,
  end: string
) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/book`,
    {
      calendarId: workpodId,
      start,
      end,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );

  return response.data;
};

export const deleteReservation = async (
  calendarId: string,
  eventId: string
) => {
  const response = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/cancel/${calendarId}/${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );

  return response.data;
};

export const getUserReservations = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/user-events`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );

  return response.data;
};

export const getSingleReservation = async (
  calendarId: string,
  eventId: string
) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/booking/${calendarId}/${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );

  return response.data;
};

export const authenticateUser = async (accessToken: string) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
    {
      googleIdToken: accessToken,
    }
  );

  return response.data;
};
