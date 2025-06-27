import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DeleteReservationPayload } from "@types";
import { reservationApi } from "api/reservations";

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
