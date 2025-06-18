import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DeleteReservationPayload } from "@types";
import { deleteReservation } from "api/reservations";

const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ calendarId, eventId }: DeleteReservationPayload) =>
      deleteReservation(calendarId, eventId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workpodCalendar", variables.calendarId],
      });
      queryClient.invalidateQueries({ queryKey: ["reservations", "user"] });
    },
    onError: (error) => {
      console.error("Reservation deletion failed:", error);
    },
  });
};

export default useDeleteReservation;
