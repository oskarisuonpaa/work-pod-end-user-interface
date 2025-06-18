import { useQuery } from "@tanstack/react-query";
import { getWorkpodCalendar } from "api/workpods";
import type { CalendarEvent } from "types/workpods";

type UseWorkpodCalendarParams = {
  workpodId?: string;
  timeMin?: string;
  timeMax?: string;
};

const useWorkpodCalendar = ({
  workpodId,
  timeMin,
  timeMax,
}: UseWorkpodCalendarParams) => {
  return useQuery<CalendarEvent[]>({
    queryKey: ["workpodCalendar", workpodId, timeMin, timeMax],
    queryFn: () => getWorkpodCalendar(workpodId!, timeMin, timeMax),
    enabled: !!workpodId,
    staleTime: 0,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
};

export default useWorkpodCalendar;
