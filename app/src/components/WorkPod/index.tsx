import { useParams } from "react-router";
import { useState } from "react";
import { useAuth } from "../../auth/useAuth";
import WorkpodCalendar from "./WorkpodCalendar";
import ReservationButton from "./ReservationButton";
import CancelButton from "./CancelButton";
import useWorkpodCalendar from "./useWorkpodCalendar";
import {
  postReservation,
  deleteReservation,
} from "../../utils/BackendCommunication";

import "./Workpod.css";

const WorkPod = () => {
  const { user } = useAuth();
  const { workpodId } = useParams<{ workpodId: string }>();
  const { events, setEvents } = useWorkpodCalendar(workpodId);

  const [selectedSlot, setSelectedSlot] = useState<{
    start: string;
    end: string;
    status: string;
    owner: string;
    eventId?: string;
  } | null>(null);

  const handleReservation = async (slot: { start: string; end: string }) => {
    if (!workpodId || !user?.name) return;

    if (confirm("Are you sure you want to reserve this slot?")) {
      await postReservation(workpodId, slot.start, slot.end);

      const updatedEvents = events.filter(
        (event) =>
          !(
            new Date(event.start).getTime() ===
              new Date(slot.start).getTime() &&
            new Date(event.end).getTime() === new Date(slot.end).getTime() &&
            event.extendedProps?.status === "free"
          )
      );

      const reservedSlot = {
        title: user.name,
        start: slot.start,
        end: slot.end,
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
        textColor: "#fff",
        extendedProps: { status: "reserved", owner: user.email },
      };

      setEvents([...updatedEvents, reservedSlot]);
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
      setEvents(updatedEvents);
      setSelectedSlot(null);
    }
  };

  if (!workpodId) return <div>Workpod ID is missing</div>;

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>{workpodId}</h1>
      </div>

      <WorkpodCalendar events={events} onSlotSelect={setSelectedSlot} />

      {selectedSlot && selectedSlot.status === "free" && (
        <ReservationButton slot={selectedSlot} onReserve={handleReservation} />
      )}

      {selectedSlot && selectedSlot.owner === user?.email && (
        <CancelButton slot={selectedSlot} onCancel={handleCancelReservation} />
      )}
    </div>
  );
};

export default WorkPod;
