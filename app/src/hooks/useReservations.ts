import { useQuery } from "@tanstack/react-query";
import { reservationApi } from "api/reservations";
import type { UserReservation } from "types/reservations";

const useReservations = () => {
  return useQuery<UserReservation[]>({
    queryKey: ["reservations", "user"],
    queryFn: reservationApi.getUserReservations,
  });
};

export default useReservations;
