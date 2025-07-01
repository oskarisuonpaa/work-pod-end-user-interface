import { useQuery } from "@tanstack/react-query";
import { reservationApi } from "api/reservations";
import type { UserReservation } from "types/reservation";

/**
 * Custom hook to fetch user reservations.
 * @returns {object} The query object containing the reservations data and status.
 * @description This hook is used to retrieve the user's reservations from the API.
 * It handles loading state and errors, providing a simple interface for components to access user reservations.
 */
const useReservations = () => {
  return useQuery<UserReservation[]>({
    queryKey: ["reservations", "user"],
    queryFn: reservationApi.getUserReservations,
  });
};

export default useReservations;
