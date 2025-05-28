import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@auth/useAuth";
import useWorkpodCalendar from "@hooks/useWorkpodCalendar";
import {
  postReservation,
  deleteReservation,
} from "@utils/backendCommunication";

import "./Workpod.css";
import PageWrapper from "../PageWrapper";
import CancelButton from "./CancelButton";
import ReserveButton from "./ReserveButton";
import WorkpodCalendar from "./WorkpodCalendar";
import { useTranslation } from "react-i18next";

const Workpod = () => {
  const { user } = useAuth();
  const { workpodId } = useParams<{ workpodId: string }>();
  const { events, setEvents } = useWorkpodCalendar(workpodId);
  const navigate = useNavigate();
  const {t} = useTranslation();

  const [selectedSlot, setSelectedSlot] = useState<{
    start: string;
    end: string;
    status: string;
    title: string;
    eventId?: string;
  } | null>(null);

  const handleReservation = async (slot: { start: string; end: string }) => {
    if (!workpodId || !user?.name) return;

    if (confirm(t("reserve-confirm-reserve"))) {
      await postReservation(workpodId, slot.start, slot.end);
      navigate(0);
    }
  };

  const handleCancelReservation = async (slot: {
    start: string;
    end: string;
    eventId?: string;
  }) => {
    if (!workpodId || !slot.eventId) return;

    if (confirm(t("reserve-confirm-cancel"))) {
      await deleteReservation(workpodId, slot.eventId);

      const updatedEvents = events.filter((event) => event.id !== slot.eventId);

      const freeSlot = {
        id: `${slot.start}-${slot.end}-free`,
        title: "Free",
        start: (new Date(slot.start)).toISOString(),
        end: (new Date(slot.end)).toISOString(),
      };

      setEvents([...updatedEvents, freeSlot]);
      setSelectedSlot(null);
    }
  };

  if (!workpodId) return <div>{t("reserve-id-missing")}</div>;

  return (
    <PageWrapper pageTitle={workpodId}>
      <WorkpodCalendar events={events} onSlotSelect={setSelectedSlot} />
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
