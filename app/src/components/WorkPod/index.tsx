import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useParams } from "react-router";

const dummyData = [
  {
    id: "84ojdg6vpqp8ga0vhs6kkprq9k",
    title: "Joel Ryynänen",
    start: "2025-05-19T12:15:00+03:00",
    end: "2025-05-19T13:15:00+03:00",
    allDay: false,
    url: "https://www.google.com/calendar/event?someurl",
  },
  {
    id: "qk5iht3g5fdu65r5snlt9p97ec",
    title: "Varattu",
    start: "2025-05-21T05:00:00+03:00",
    end: "2025-05-21T06:00:00+03:00",
    allDay: false,
    url: "https://www.google.com/calendar/event?someurl",
  },
];

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
        events={dummyData} // Dummy data for events
      />
    </div>
  );
};

export default WorkPod;
