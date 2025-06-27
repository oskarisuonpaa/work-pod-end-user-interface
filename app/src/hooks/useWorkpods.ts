import { useQuery } from "@tanstack/react-query";
import { getWorkpods } from "api/workpods";

const useWorkpods = () => {
  return useQuery({
    queryKey: ["workpods"],
    queryFn: async () => {
      const calendars = await getWorkpods();
      return calendars;
    },
    staleTime: 0,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });
};

export default useWorkpods;
