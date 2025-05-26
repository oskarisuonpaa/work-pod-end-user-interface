import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getWorkpodCalendar,
  postReservation,
} from "../../utils/BackendCommunication";
import "./WorkPod.css";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../AuthProvider";

type DecodedUser = {
  name: string;
  [key: string]: any;
};

const WorkPod = () => {
  const { token } = useAuth();
  const user = jwtDecode<DecodedUser>(token);

  const navigate = useNavigate();
  const { workpodId } = useParams<{ workpodId: string }>();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: string;
    end: string;
  } | null>(null);

  if (!workpodId) {
    return <div>Workpod ID is missing</div>;
  }

  useEffect(() => {
    const fetchWorkpodCalendar = async () => {
      try {
        const bookedEvents = await getWorkpodCalendar(workpodId);
        const startHour = 8;
        const endHour = 18;
        const today = new Date();
        today.setMinutes(0, 0, 0);

        const freeSlots = [];

        for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
          const day = new Date(today);
          day.setDate(today.getDate() + dayOffset);

          for (let hour = startHour; hour < endHour; hour++) {
            const start = new Date(day);
            const end = new Date(day);
            start.setHours(hour);
            end.setHours(hour + 1);

            const overlaps = bookedEvents.some((event: any) => {
              const bookedStart = new Date(event.start).getTime();
              const bookedEnd = new Date(event.end).getTime();
              const slotStart = start.getTime();
              const slotEnd = end.getTime();

              return (
                (slotStart >= bookedStart && slotStart < bookedEnd) ||
                (slotEnd > bookedStart && slotEnd <= bookedEnd) ||
                (slotStart <= bookedStart && slotEnd >= bookedEnd)
              );
            });

            if (!overlaps) {
              freeSlots.push({
                title: "Free",
                start,
                end,
                backgroundColor: "var(--green)",
                borderColor: "#c3e6cb",
                extendedProps: {
                  status: "free",
                },
              });
            }
          }
        }

        setEvents([...bookedEvents, ...freeSlots]);
      } catch (error) {
        console.error("Error fetching workpod calendar:", error);
      }
    };

    fetchWorkpodCalendar();
  }, [workpodId]);

  const handleReservation = async (slot: { start: string; end: string }) => {
    if (confirm("Are you sure you want to reserve this slot?")) {
      const response = await postReservation(workpodId, slot.start, slot.end);
      console.log("Reservation response:", response);

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
        extendedProps: {
          status: "reserved",
        },
      };

      setEvents([...updatedEvents, reservedSlot]);
      setSelectedSlot(null);
      navigate("/reservations");
    }
  };

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>{workpodId}</h1>
      </div>
      <FullCalendar
        plugins={[timeGridPlugin]}
        locale={"fi"}
        initialView="timeGridDay"
        allDaySlot={false}
        nowIndicator={true}
        events={events}
        eventClick={(info) => {
          const event = info.event;
          if (event.extendedProps.status === "free") {
            const start = event.start?.toISOString();
            const end = event.end?.toISOString();
            if (start && end) {
              setSelectedSlot({ start, end });
            }
          } else {
            setSelectedSlot(null);
          }
        }}
        eventMinHeight={40}
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        height={"60vh"}
      />
      {selectedSlot && (
        <div className="button-container">
          <button
            className="reservation-button"
            onClick={() => handleReservation(selectedSlot)}
          >
            Reserve Slot
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkPod;
