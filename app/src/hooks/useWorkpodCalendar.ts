import { useQuery } from "@tanstack/react-query";
import { getWorkpodCalendar } from "@utils/backendCommunication";
import { generateFreeSlots } from "@utils/helpers";
import type { BookedEvent } from "@types";
import { useTranslation } from "react-i18next";

const useWorkpodCalendar = (workpodId?: string) => {
  const { i18n } = useTranslation();

  return useQuery({
    queryKey: ["workpodCalendar", workpodId, i18n.language],
    queryFn: async () => {
      const bookedEvents: BookedEvent[] = await getWorkpodCalendar(workpodId!);
      const freeSlots = generateFreeSlots(bookedEvents);
      return [...bookedEvents, ...freeSlots];
    },
    enabled: !!workpodId,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};

export default useWorkpodCalendar;
