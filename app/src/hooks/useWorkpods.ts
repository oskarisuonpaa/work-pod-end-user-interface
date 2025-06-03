import { useQuery } from "@tanstack/react-query";
import type { Workpod } from "@types";
import { getWorkpods } from "@utils/backendCommunication";

export const useWorkpods = () =>
  useQuery({
    queryKey: ["workpods"],
    queryFn: async () => {
      const data = await getWorkpods();
      return data.calendars as Workpod[];
    },
    staleTime: Infinity,
  });
