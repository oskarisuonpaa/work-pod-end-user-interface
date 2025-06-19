import { useQuery } from "@tanstack/react-query";
import { getWorkpods } from "api/workpods";

const useWorkpods = () => {
  return useQuery({
    queryKey: ["workpods"],
    queryFn: async () => {
      const data = await getWorkpods();
      return data.calendars;
    },
    staleTime: 0,
    refetchInterval: WORKPODS_REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });
};

export default useWorkpods;
