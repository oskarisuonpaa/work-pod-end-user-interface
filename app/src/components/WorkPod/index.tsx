import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { useAuth } from "../../auth/useAuth";
import WorkpodCalendar from "./WorkpodCalendar";
import ReserveButton from "./ReserveButton";
import CancelButton from "./CancelButton";
import useWorkpodCalendar from "../../hooks/useWorkpodCalendar";
import {
  postReservation,
  deleteReservation,
} from "../../utils/BackendCommunication";
import PageWrapper from "../PageWrapper";

import "./WorkPod.css";

const Workpod = () => {
  const { user } = useAuth();
  const { workpodId } = useParams<{ workpodId: string }>();
  const { events, setEvents } = useWorkpodCalendar(workpodId);
  const navigate = useNavigate();

  const [selectedSlot, setSelectedSlot] = useState<{
    start: string;
    end: string;
    status: string;
    title: string;
    eventId?: string;
  } | null>(null);

  const handleReservation = async (slot: { start: string; end: string }) => {
    if (!workpodId || !user?.name) return;

    if (confirm("Are you sure you want to reserve this slot?")) {
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

    if (confirm("Are you sure you want to cancel this reservation?")) {
      await deleteReservation(workpodId, slot.eventId);

      const updatedEvents = events.filter((event) => event.id !== slot.eventId);

      const freeSlot = {
        title: "Free",
        start: slot.start,
        end: slot.end,
        backgroundColor: "var(--green)",
        borderColor: "#c3e6cb",
        extendedProps: {
          status: "free",
        },
      };

      setEvents([...updatedEvents, freeSlot]);
      setSelectedSlot(null);
    }
  };

  if (!workpodId) return <div>Workpod ID is missing</div>;

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
