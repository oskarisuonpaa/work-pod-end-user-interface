import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

type CalendarProps = {
  events: any[];
  onSlotSelect: (slot: {
    start: string;
    end: string;
    status: string;
    owner: string;
  }) => void;
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
      const { start, end, extendedProps, id } = info.event;

      if (start && end && extendedProps) {
        const slot = {
          start: start.toISOString(),
          end: end.toISOString(),
          status: extendedProps.status,
          owner: extendedProps.description
            ? extendedProps.description.split(": ")[1]
            : "",
          eventId: id || undefined,
        };

        onSlotSelect(slot);
      }
    }}
    eventMinHeight={40}
    slotMinTime="08:00:00"
    slotMaxTime="18:00:00"
    height="60vh"
  />
);

export default WorkpodCalendar;
