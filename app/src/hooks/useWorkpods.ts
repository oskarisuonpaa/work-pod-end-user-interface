import { useQuery } from "@tanstack/react-query";
import { getWorkpods } from "@utils/backendCommunication";

export const useWorkpods = () =>
  useQuery({
    queryKey: ["workpods"],
    queryFn: async () => {
      const data = await getWorkpods();
      return data.calendars as string[];
    },
    staleTime: Infinity,
  });
