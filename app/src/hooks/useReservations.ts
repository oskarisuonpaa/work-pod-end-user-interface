import { useQuery } from "@tanstack/react-query";
import type { ReservationType } from "@types";
import { getUserReservations } from "@utils/backendCommunication";

export const useReservations = () => {
  return useQuery<ReservationType[], Error>({
    queryKey: ["userReservations"],
    queryFn: getUserReservations,
    staleTime: 60 * 1000,
    retry: 1,
  });
};
