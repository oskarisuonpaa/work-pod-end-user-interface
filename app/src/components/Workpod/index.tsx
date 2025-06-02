import { useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "@auth/useAuth";
import useWorkpodCalendar from "@hooks/useWorkpodCalendar";
import usePostReservation from "@hooks/usePostReservation";
import useDeleteReservation from "@hooks/useDeleteReservation";

import "./Workpod.css";
import PageWrapper from "../PageWrapper";
import CancelButton from "./CancelButton";
import ReserveButton from "./ReserveButton";
import WorkpodCalendar from "./WorkpodCalendar";
import { useTranslation } from "react-i18next";

const Workpod = () => {
  const { user } = useAuth();
  const { workpodId } = useParams<{ workpodId: string }>();
  const { date } =
    useParams<{ date: string | undefined }>() ||
    new Date().toISOString().slice(0, 10);
  const { data: events = [] } = useWorkpodCalendar(workpodId);
  const { t } = useTranslation();

  const [selectedSlot, setSelectedSlot] = useState<{
    start: string;
    end: string;
    status: string;
    title: string;
    eventId?: string;
  } | null>(null);

  const postReservationMutation = usePostReservation();
  const deleteReservationMutation = useDeleteReservation();

  const handleReservation = async (slot: { start: string; end: string }) => {
    if (!workpodId || !user?.name) return;
    if (confirm(t("reserve-confirm-reserve"))) {
      await postReservationMutation.mutateAsync({
        workpodId,
        start: slot.start,
        end: slot.end,
      });
    }
  };

  const handleCancelReservation = async (slot: {
    start: string;
    end: string;
    eventId?: string;
  }) => {
    if (!workpodId || !slot.eventId) return;
    if (confirm(t("reserve-confirm-cancel"))) {
      await deleteReservationMutation.mutateAsync({
        calendarId: workpodId,
        eventId: slot.eventId,
      });
      setSelectedSlot(null);
    }
  };

  if (!workpodId) return <div>{t("reserve-id-missing")}</div>;

  return (
    <PageWrapper pageTitle={workpodId}>
      <WorkpodCalendar
        events={events}
        onSlotSelect={setSelectedSlot}
        date={date}
      />
      {selectedSlot && selectedSlot.status === "free" && (
        <ReserveButton slot={selectedSlot} onReserve={handleReservation} />
      )}
      {selectedSlot && selectedSlot.title === user?.name && (
        <CancelButton slot={selectedSlot} onCancel={handleCancelReservation} />
      )}
    </PageWrapper>
  );
};

export default Workpod;
