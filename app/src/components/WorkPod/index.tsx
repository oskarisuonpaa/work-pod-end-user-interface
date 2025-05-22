import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getWorkpodCalendar } from "../../utils/BackendCommunication";

const WorkPod = () => {
  const { workpodId } = useParams<{ workpodId: string }>();
  const [events, setEvents] = useState<any[]>([]);

  if (!workpodId) {
    return <div>Workpod ID is missing</div>;
  }

  useEffect(() => {
    const fetchWorkpodCalendar = async () => {
      try {
        const data = await getWorkpodCalendar(workpodId);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching workpod calendar:", error);
      }
    };

    fetchWorkpodCalendar();
  }, []);

  return (
    <div className="page-content">
      <div className="page-title">
        <h1>{workpodId}</h1>
      </div>
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridDay"
        slotDuration="01:00:00" // 1 hour slots
        allDaySlot={false} // Hide all-day slot
        nowIndicator={true} // Show current time line
        slotMinTime="08:00:00" // Start of visible day
        slotMaxTime="18:00:00" // End of visible day
        selectable={true} // Allow clicking to select slots
        selectMirror={true}
        select={(info) => {
          alert(`Selected from ${info.startStr} to ${info.endStr}`);
        }}
        events={events}
      />
    </div>
  );
};

export default WorkPod;
