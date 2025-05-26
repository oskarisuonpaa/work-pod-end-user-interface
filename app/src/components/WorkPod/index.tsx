import { useParams, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useAuth } from "../AuthProvider";
import WorkpodCalendar from "./WorkpodCalendar";
import ReservationButton from "./ReservationButton";
import useWorkpodCalendar from "./useWorkpodCalendar";
import { postReservation } from "../../utils/BackendCommunication";
import "./Workpod.css";

type DecodedUser = {
  name: string;
  [key: string]: any;
};

const WorkPod = () => {
  const { token } = useAuth();
  const user = jwtDecode<DecodedUser>(token);
  const { workpodId } = useParams<{ workpodId: string }>();
  const navigate = useNavigate();

  const { events, setEvents } = useWorkpodCalendar(workpodId);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const handleReservation = async (slot: { start: string; end: string }) => {
    if (!workpodId) return;

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
        title: `Varattu - ${user.name}`,
        start: slot.start,
        end: slot.end,
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
        textColor: "#fff",
        extendedProps: { status: "reserved" },
      };

      setEvents([...updatedEvents, reservedSlot]);
      setSelectedSlot(null);
      navigate("/reservations");
    }
  };

  if (!workpodId) return <div>Workpod ID is missing</div>;

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>{workpodId}</h1>
      </div>
      <WorkpodCalendar events={events} onSlotSelect={setSelectedSlot} />
      {selectedSlot && (
        <ReservationButton slot={selectedSlot} onReserve={handleReservation} />
      )}
    </div>
  );
};

export default WorkPod;
