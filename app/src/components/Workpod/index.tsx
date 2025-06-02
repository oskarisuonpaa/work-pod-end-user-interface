import { useState, useCallback } from "react";
import { useParams } from "react-router";
import { useAuth } from "@auth/useAuth";
import useWorkpodCalendar from "@hooks/useWorkpodCalendar";
import usePostReservation from "@hooks/usePostReservation";
import useDeleteReservation from "@hooks/useDeleteReservation";
import type { SelectedSlot } from "@types";

import "./Workpod.css";
import PageWrapper from "../PageWrapper";
import CancelButton from "./CancelButton";
import ReserveButton from "./ReserveButton";
import WorkpodCalendar from "./WorkpodCalendar";
import { useTranslation } from "react-i18next";

const Workpod = () => {
  const { user } = useAuth();
  const { workpodId, date: paramDate } = useParams<{
    workpodId: string;
    date?: string;
  }>();
  const date = paramDate ?? new Date().toISOString().slice(0, 10);
  const { data: events = [] } = useWorkpodCalendar(workpodId);
  const { t } = useTranslation();

  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const { mutateAsync: reserve } = usePostReservation();
  const { mutateAsync: cancel } = useDeleteReservation();

  const handleReservation = useCallback(
    async (slot: { start: string; end: string }) => {
      if (!workpodId || !user?.name) return;
      if (confirm(t("reserve-confirm-reserve"))) {
        await reserve({ workpodId, start: slot.start, end: slot.end });
      }
    },
    [workpodId, user?.name, t, reserve]
  );

  const handleCancelReservation = useCallback(
    async (slot: { start: string; end: string; eventId?: string }) => {
      if (!workpodId || !slot.eventId) return;
      if (confirm(t("reserve-confirm-cancel"))) {
        await cancel({ calendarId: workpodId, eventId: slot.eventId });
        setSelectedSlot(null);
      }
    },
    [workpodId, cancel, t]
  );

  if (!workpodId) return <div>{t("reserve-id-missing")}</div>;

  return (
    <PageWrapper pageTitle={workpodId}>
      <WorkpodCalendar
        events={events}
        onSlotSelect={setSelectedSlot}
        date={date}
      />
      {selectedSlot?.status === "free" && (
        <ReserveButton slot={selectedSlot} onReserve={handleReservation} />
      )}
      {selectedSlot?.title === user?.name && selectedSlot && (
        <CancelButton slot={selectedSlot} onCancel={handleCancelReservation} />
      )}
    </PageWrapper>
  );
};

export default Workpod;
