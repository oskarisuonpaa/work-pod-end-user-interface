import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationApi } from "api/reservations";
import type { DeleteReservationPayload } from "types/reservations";

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
