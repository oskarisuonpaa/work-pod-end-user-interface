import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DeleteReservationPayload } from "@types";
import { reservationApi } from "api/reservations";

/**
 * Custom hook to delete a reservation.
 * @returns {object} The mutation object containing the delete function and status.
 * @description This hook is used to delete a reservation by calling the API.
 * It handles the mutation logic and provides feedback on success or error.
 * It also invalidates the queries related to the calendar and user reservations to ensure the UI is
 * updated with the latest data.
 */
const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteReservationPayload) =>
      reservationApi.deleteReservation(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workpodCalendar", variables.calendarId],
      });
      queryClient.invalidateQueries({ queryKey: ["reservations", "user"] });
    },

    onError: (error) => {
      console.error("Failed to delete reservation:", error);
    },
  });
};

export default useDeleteReservation;
