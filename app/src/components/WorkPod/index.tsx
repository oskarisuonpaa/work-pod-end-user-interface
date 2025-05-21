import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useParams } from "react-router";

const WorkPod = () => {
  const { workpodId } = useParams<{ workpodId: string }>();

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
        events={[
          {
            title: "John Doe",
            start: "2025-05-21T09:00:00",
            end: "2025-05-21T10:00:00",
          },
        ]}
      />
    </div>
  );
};

export default WorkPod;
