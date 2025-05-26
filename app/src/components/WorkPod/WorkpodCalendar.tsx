import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

type CalendarProps = {
  events: any[];
  onSlotSelect: (slot: { start: string; end: string }) => void;
};

const WorkpodCalendar = ({ events, onSlotSelect }: CalendarProps) => (
  <FullCalendar
    plugins={[timeGridPlugin]}
    locale="fi"
    initialView="timeGridDay"
    allDaySlot={false}
    nowIndicator={true}
    events={events}
    eventClick={(info) => {
      const { start, end, extendedProps } = info.event;
      if (extendedProps.status === "free" && start && end) {
        onSlotSelect({ start: start.toISOString(), end: end.toISOString() });
      }
    }}
    eventMinHeight={40}
    slotMinTime="08:00:00"
    slotMaxTime="18:00:00"
    height="60vh"
  />
);

export default WorkpodCalendar;
