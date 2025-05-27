import { useEffect, useState } from "react";
import { getWorkpodCalendar } from "../utils/BackendCommunication";
import { generateFreeSlots } from "../utils/helpers";

const useWorkpodCalendar = (workpodId?: string) => {
  const [events, setEvents] = useState<any[]>([]);

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
