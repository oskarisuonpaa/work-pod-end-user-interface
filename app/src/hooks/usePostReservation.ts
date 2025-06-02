import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postReservation } from "@utils/backendCommunication";

const usePostReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workpodId,
      start,
      end,
    }: {
      workpodId: string;
      start: string;
      end: string;
    }) => postReservation(workpodId, start, end),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workpodCalendar", variables.workpodId],
      });
      queryClient.invalidateQueries({ queryKey: ["userReservations"] });
    },
  });
};

export default usePostReservation;
