import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostReservationPayload } from "@types";
import { reservationApi } from "api/reservations";

/**
 * Custom hook to post a reservation.
 * @returns {object} The mutation object containing the post function and status.
 * @description This hook is used to create a new reservation by calling the API.
 * It handles the mutation logic and provides feedback on success or error.
 * It also invalidates the queries related to the calendar and user reservations to ensure the UI is
 * updated with the latest data.
 */
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
