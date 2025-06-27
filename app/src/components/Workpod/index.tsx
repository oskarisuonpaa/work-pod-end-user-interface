import { useState, useCallback, useRef, useEffect } from "react";
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
  const reserveButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const date = isValidDate(paramDate)
    ? paramDate!
    : new Date().toISOString().slice(0, 10);

  const { data: events = [] } = useWorkpodCalendar(workpodId!);

  // track multiple selected slots
  const [selectedSlots, setSelectedSlots] = useState<CalendarEvent[]>([]);

  const { mutateAsync: reserve } = usePostReservation();
  const { mutateAsync: cancel } = useDeleteReservation();

  /** Bulk-reserve all free slots in our selection */
  const handleBulkReserve = useCallback(async () => {
    if (!workpodId || !user?.name) return;
    const userName = user.name; // now definitely a string

    const freeSlots = selectedSlots.filter(
      (s) => s.extendedProps.status === "free"
    );
    if (freeSlots.length === 0) return;

    if (confirm(t("reserve-confirm-reserve"))) {
      for (const slot of freeSlots) {
        await reserve({
          calendarId: workpodId,
          start: slot.start,
          end: slot.end,
        });
      }
      setSelectedSlots((slots) =>
        slots.map((s) =>
          s.extendedProps.status === "free"
            ? {
                ...s,
                title: userName,
                extendedProps: {
                  status: "booked",
                },
              }
            : s
        )
      );
    }
  }, [workpodId, selectedSlots, user?.name, reserve, t]);

  /** Bulk-cancel all slots the user owns */
  const handleBulkCancel = useCallback(async () => {
    if (!workpodId || !user?.name) return;
    const userName = user.name;

    const mySlots = selectedSlots.filter((s) => s.title === userName && s.id);
    if (mySlots.length === 0) return;

    if (confirm(t("reserve-confirm-cancel"))) {
      for (const slot of mySlots) {
        await cancel({
          calendarId: workpodId,
          reservationId: slot.id!,
        });
      }
      setSelectedSlots((slots) => slots.filter((s) => s.title !== userName));
    }
  }, [workpodId, selectedSlots, user?.name, cancel, t]);

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
        onSlotsChange={setSelectedSlots}
      />

      {selectedSlots.some((s) => s.extendedProps.status === "free") && (
        <ReserveButton
          slots={selectedSlots.filter((s) => s.extendedProps.status === "free")}
          onReserve={handleBulkReserve}
          buttonRef={reserveButtonRef}
        />
      )}

      {selectedSlots.some((s) => s.title === user?.name) && (
        <CancelButton
          slots={selectedSlots.filter((s) => s.title === user?.name)}
          onCancel={handleBulkCancel}
          buttonRef={cancelButtonRef}
        />
      )}
    </PageWrapper>
  );
};

export default Workpod;
