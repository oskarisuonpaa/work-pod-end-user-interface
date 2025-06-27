import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationApi } from "api/reservations";
import type { PostReservationPayload } from "types/reservation";

const usePostReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PostReservationPayload) =>
      reservationApi.postReservation(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workpodCalendar", variables.calendarId],
      });
      queryClient.invalidateQueries({ queryKey: ["reservations", "user"] });
    },

    onError: (error) => {
      console.error("Failed to post reservation:", error);
    },
  });
};

export default usePostReservation;
