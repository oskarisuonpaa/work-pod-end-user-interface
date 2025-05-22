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
      params: {
        calendarId: workpodId,
        start: start,
        end: end,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );

  return response.data;
};
