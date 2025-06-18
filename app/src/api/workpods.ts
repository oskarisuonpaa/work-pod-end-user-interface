import axios from "axios";
import formatDate from "@utils/formatDate";

export const getWorkpodCalendar = async (
  workpodId: string,
  timeMin?: string,
  timeMax?: string
) => {
  if (timeMin) {
    const date = new Date(timeMin);
    timeMax =
      timeMax ||
      formatDate(new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000));
  } else {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(0, 0, 0);
    timeMin = formatDate(now);
    timeMax = formatDate(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
  }

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
