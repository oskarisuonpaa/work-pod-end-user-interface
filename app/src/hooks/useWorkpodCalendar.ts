import { useQuery } from "@tanstack/react-query";
import type { CalendarEvent } from "@types";
import generateFreeSlots from "@utils/generateFreeSlots";
import { getWorkpodCalendar } from "api/workpods";
import { useTranslation } from "react-i18next";

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
