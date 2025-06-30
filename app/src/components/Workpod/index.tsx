import { useState, useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { useAuth } from "@auth/useAuth";
import useWorkpodCalendar from "@hooks/useWorkpodCalendar";
import usePostReservation from "@hooks/usePostReservation";
import useDeleteReservation from "@hooks/useDeleteReservation";

import "./Workpod.css";
import PageWrapper from "../PageWrapper";
import ReserveButton from "./ReserveButton";
import CancelButton from "./CancelButton";
import WorkpodCalendar from "./WorkpodCalendar";
import { useTranslation } from "react-i18next";
import type { CalendarEvent } from "@types";

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

  const date = isValidDate(paramDate)
    ? paramDate!
    : new Date().toISOString().slice(0, 10);

  const { data: events = [], refetch } = useWorkpodCalendar(workpodId!);

  // track multiple selected slots in parent
  const [selectedSlots, setSelectedSlots] = useState<CalendarEvent[]>([]);

  const { mutateAsync: reserve } = usePostReservation();
  const { mutateAsync: cancel } = useDeleteReservation();

  const handleBulkReserve = useCallback(async () => {
    if (!workpodId || !user?.name) return;

    const freeSlots = selectedSlots.filter(
      (s) => s.extendedProps.status === "free"
    );
    if (freeSlots.length === 0) return;

    const combinedSlots = freeSlots
      .sort((a, b) => +new Date(a.start) - +new Date(b.start))
      .reduce<CalendarEvent[]>((acc, slot) => {
        const last = acc[acc.length - 1];
        if (
          last &&
          new Date(last.end).getTime() === new Date(slot.start).getTime()
        ) {
          last.end = slot.end;
        } else {
          acc.push({ ...slot });
        }
        return acc;
      }, []);

    if (confirm(t("reserve-confirm-reserve"))) {
      for (const slot of combinedSlots) {
        await reserve({
          calendarId: workpodId,
          start: slot.start,
          end: slot.end,
        });
      }

      await refetch();
      setSelectedSlots([]);
    }
  }, [workpodId, user?.name, selectedSlots, t, refetch, reserve]);

  const handleBulkCancel = useCallback(async () => {
    if (!workpodId || !user?.name) return;
    const userName = user.name;

    const mySlots = selectedSlots.filter((s) => s.title === userName && s.id);
    if (mySlots.length === 0) return;

    if (confirm(t("reserve-confirm-cancel"))) {
      for (const slot of mySlots) {
        await cancel({ calendarId: workpodId, reservationId: slot.id! });
      }

      await refetch();
      setSelectedSlots([]);
    }
  }, [workpodId, user?.name, selectedSlots, t, refetch, cancel]);

  // Auto-reserve via QR params
  useEffect(() => {
    if (
      qrStart &&
      qrEnd &&
      isValidDate(qrStart) &&
      isValidDate(qrEnd) &&
      user?.name &&
      workpodId
    ) {
      handleBulkReserve();
    }
  }, [qrStart, qrEnd, user?.name, workpodId, handleBulkReserve]);

  if (!workpodId) {
    return <div>{t("reserve-id-missing")}</div>;
  }

  return (
    <PageWrapper pageTitle={workpodId}>
      <WorkpodCalendar
        events={events}
        date={date}
        selectedSlots={selectedSlots}
        onSlotsChange={setSelectedSlots}
      />

      {selectedSlots.some((s) => s.extendedProps.status === "free") && (
        <ReserveButton
          slots={selectedSlots.filter((s) => s.extendedProps.status === "free")}
          onReserve={handleBulkReserve}
        />
      )}

      {selectedSlots.some((s) => s.title === user?.name) && (
        <CancelButton
          slots={selectedSlots.filter((s) => s.title === user?.name)}
          onCancel={handleBulkCancel}
        />
      )}
    </PageWrapper>
  );
};

export default Workpod;
