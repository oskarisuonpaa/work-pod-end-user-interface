import type { EventClickArg, EventInput } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

type CalendarProps = {
  events: EventInput[];
  date: string | undefined;
  onSlotSelect: (slot: {
    start: string;
    end: string;
    status: string;
    title: string;
  }) => void;
};

const WorkpodCalendar = ({ events, onSlotSelect, date }: CalendarProps) => {
  const handleEventClick = (info: EventClickArg) => {
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
      initialDate={date}
      eventClick={handleEventClick}
      eventMinHeight={40}
      slotMinTime="00:00:00"
      slotMaxTime="24:00:00"
      height="1242px"
    />
  );
};

export default WorkpodCalendar;
