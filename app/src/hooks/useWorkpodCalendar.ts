// hooks/useWorkpodCalendar.ts
import { useQuery } from "@tanstack/react-query";
import { getWorkpodCalendar } from "@utils/backendCommunication";
import { generateFreeSlots } from "@utils/helpers";
import type { BookedEvent } from "@types";

const useWorkpodCalendar = (workpodId?: string) =>
  useQuery({
    queryKey: ["workpodCalendar", workpodId],
    queryFn: async () => {
      const bookedEvents: BookedEvent[] = await getWorkpodCalendar(workpodId!);
      const freeSlots = generateFreeSlots(bookedEvents);
      return [...bookedEvents, ...freeSlots];
    },
    enabled: !!workpodId,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });

export default useWorkpodCalendar;
