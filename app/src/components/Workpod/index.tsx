import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
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
import type { SelectedSlot } from "@types";

const isValidDate = (dateString?: string) =>
  !!dateString && !isNaN(Date.parse(dateString));

const Workpod = () => {
  const { user } = useAuth();
  const { workpodId, date: paramDate } = useParams<{
    workpodId: string;
    date?: string;
  }>();
  const [searchParams] = useSearchParams();
  const qrStart = searchParams.get("start");
  const qrEnd = searchParams.get("end");
  const { t } = useTranslation();
  const reserveButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const date = isValidDate(paramDate)
    ? paramDate!
    : new Date().toISOString().slice(0, 10);

  const { data: events = [] } = useWorkpodCalendar({ workpodId });
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const { mutateAsync: reserve } = usePostReservation();
  const { mutateAsync: cancel } = useDeleteReservation();

  const handleReservation = useCallback(
    async (slot: { start: string; end: string }) => {
      if (!workpodId || !user?.name) return;
      if (confirm(t("reserve-confirm-reserve"))) {
        await reserve({
          calendarId: workpodId,
          start: slot.start,
          end: slot.end,
        });
        setSelectedSlot({
          start: slot.start,
          end: slot.end,
          status: "booked",
          title: user.name,
        });
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

  useEffect(() => {
    if (selectedSlot?.status === "free" && reserveButtonRef.current) {
      reserveButtonRef.current.focus();
    } else if (selectedSlot?.title === user?.name && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [selectedSlot, user?.name]);

  useEffect(() => {
    if (
      qrStart &&
      qrEnd &&
      isValidDate(qrStart) &&
      isValidDate(qrEnd) &&
      user?.name &&
      workpodId
    ) {
      const autoSlot = { start: qrStart, end: qrEnd };
      handleReservation(autoSlot);
    }
  }, [qrStart, qrEnd, user?.name, workpodId, handleReservation]);

  if (!workpodId) return <div>{t("reserve-id-missing")}</div>;

  return (
    <PageWrapper pageTitle={workpodId}>
      <WorkpodCalendar
        events={events}
        onSlotSelect={setSelectedSlot}
        date={date}
      />
      {selectedSlot?.status === "free" && (
        <ReserveButton
          slot={selectedSlot}
          onReserve={handleReservation}
          buttonRef={reserveButtonRef}
        />
      )}
      {selectedSlot && selectedSlot.title === user?.name && (
        <CancelButton
          slot={selectedSlot}
          onCancel={handleCancelReservation}
          buttonRef={cancelButtonRef}
        />
      )}
    </PageWrapper>
  );
};

export default Workpod;
