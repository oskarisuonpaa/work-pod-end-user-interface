import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

type CalendarProps = {
  events: any[];
  onSlotSelect: (slot: {
    start: string;
    end: string;
    status: string;
    title: string;
  }) => void;
};

const WorkpodCalendar = ({ events, onSlotSelect }: CalendarProps) => {
  const handleEventClick = (info: any) => {
    const { start, end, extendedProps, id, title } = info.event;

    if (start && end && extendedProps) {
      const slot = {
        start: start.toISOString(),
        end: end.toISOString(),
        status: extendedProps.status,
        title: title || "",
        eventId: id || undefined,
      };

      onSlotSelect(slot);
    }
  };

  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      locale="fi"
      initialView="timeGridDay"
      allDaySlot={false}
      nowIndicator={true}
      events={events}
      eventClick={handleEventClick}
      eventMinHeight={40}
      slotMinTime="08:00:00"
      slotMaxTime="18:00:00"
      height="60vh"
    />
  );
};

export default WorkpodCalendar;
