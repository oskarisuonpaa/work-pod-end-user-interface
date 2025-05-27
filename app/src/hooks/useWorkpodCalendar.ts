import { useEffect, useState } from "react";
import { generateFreeSlots } from "../utils/helpers";
import { getWorkpodCalendar } from "../utils/BackendCommunication";

type CalendarEvent = {
  id?: string;
  title: string;
  start: string;
  end: string;
  
};

const useWorkpodCalendar = (workpodId?: string) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (!workpodId) return;

    const fetchData = async () => {
      try {
        const bookedEvents = await getWorkpodCalendar(workpodId);
        const freeSlots = generateFreeSlots(bookedEvents);
        setEvents([...bookedEvents, ...freeSlots]);
      } catch (err) {
        console.error("Error fetching calendar:", err);
      }
    };

    fetchData();
  }, [workpodId]);

  return { events, setEvents };
};

export default useWorkpodCalendar;
