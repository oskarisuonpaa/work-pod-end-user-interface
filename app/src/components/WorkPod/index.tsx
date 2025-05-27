import { useParams } from "react-router";
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
import PageWrapper from "../../components/PageWrapper";

import "./Workpod.css";
import { isSameSlot } from "../../utils/helpers";

const Workpod = () => {
  const { user } = useAuth();
  const { workpodId } = useParams<{ workpodId: string }>();
  const { events, setEvents } = useWorkpodCalendar(workpodId);

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

      const updatedEvents = events.filter(
        (event) =>
          !(isSameSlot(event, slot) && event.extendedProps?.status === "free")
      );

      const reservedSlot = {
        title: user.name,
        start: slot.start,
        end: slot.end,
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
        textColor: "#fff",
        extendedProps: { status: "reserved" },
      };

      setEvents([...updatedEvents, reservedSlot]);
    }
  };

  const handleCancelReservation = async (slot: {
    start: string;
    end: string;
    eventId?: string;
  }) => {
    console.log("handleCancelReservation", slot);
    if (!workpodId || !slot.eventId) return;

    if (confirm("Are you sure you want to cancel this reservation?")) {
      await deleteReservation(workpodId, slot.eventId);

      const updatedEvents = events.filter((event) => event.id !== slot.eventId);
      setEvents(updatedEvents);
      setSelectedSlot(null);
    }
  };

  if (!workpodId) return <div>Workpod ID is missing</div>;

  console.log(selectedSlot);

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
