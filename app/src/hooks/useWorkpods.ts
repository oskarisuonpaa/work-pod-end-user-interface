import { useQuery } from "@tanstack/react-query";
import { getWorkpods } from "api/workpods";

/**
 * Custom hook to fetch workpods.
 * @returns {object} The query object containing the workpods data and status.
 * @description This hook is used to retrieve the list of workpods from the API.
 * It handles loading state and errors, providing a simple interface for components to access workpods.
 * It refetches the data every 10 seconds to keep the workpods list up-to-date.
 */
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
