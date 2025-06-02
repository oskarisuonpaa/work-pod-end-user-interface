import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReservation } from "@utils/backendCommunication";

const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      calendarId,
      eventId,
    }: {
      calendarId: string;
      eventId: string;
    }) => deleteReservation(calendarId, eventId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workpodCalendar", variables.calendarId],
      });
      queryClient.invalidateQueries({ queryKey: ["userReservations"] });
    },
  });
};

export default useDeleteReservation;
