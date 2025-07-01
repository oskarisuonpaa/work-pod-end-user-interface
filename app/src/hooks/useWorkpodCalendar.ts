import { useQuery } from "@tanstack/react-query";
import type { CalendarEvent } from "@types";
import generateFreeSlots from "@utils/generateFreeSlots";
import { getWorkpodCalendar } from "api/workpods";
import { useTranslation } from "react-i18next";

/**
 * Custom hook to fetch the workpod calendar.
 * @param {string} workpodId - The ID of the workpod to fetch the calendar for.
 * @returns {object} The query object containing the calendar events and status.
 * @description This hook is used to retrieve the calendar events for a specific workpod.
 * It combines booked events with generated free slots to provide a complete view of availability.
 * It refetches the data every 10 seconds to keep the calendar up-to-date.
 */
const useWorkpodCalendar = (workpodId?: string) => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ["workpodCalendar", workpodId, i18n.language],
    queryFn: async () => {
      const bookedEvents: CalendarEvent[] = await getWorkpodCalendar(
        workpodId!
      );
      const freeSlots = generateFreeSlots(bookedEvents);
      return [...bookedEvents, ...freeSlots];
    },
    enabled: !!workpodId,
    staleTime: 0,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });
};

export default useWorkpodCalendar;
