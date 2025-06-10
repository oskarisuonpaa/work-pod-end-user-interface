import type { EventClickArg, EventInput } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { SelectedSlot, SlotStatus } from "@types";
import i18next from "i18next";

type CalendarProps = {
  events: EventInput[];
  date: string | undefined;
  onSlotSelect: (slot: SelectedSlot | null) => void;
};

const WorkpodCalendar = ({ events, onSlotSelect, date }: CalendarProps) => {
  const handleEventClick = (info: EventClickArg) => {
    const { start, end, extendedProps, id, title } = info.event;

    
    if (start && end) {
      if (end <= new Date()) {
        onSlotSelect(null);
        return;
      }

      const slot: SelectedSlot = {
        start: start.toISOString(),
        end: end.toISOString(),
        status: extendedProps.status as SlotStatus,
        title: title || "",
        eventId: id && id !== "" ? id : undefined,
      };

      onSlotSelect(slot);
    }
  };
  //need to set the minutes to 0 to show current events as well
  const now = new Date();
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  const filteredEvents = events.filter(event => {
    // Assuming event.start is a Date or ISO string
    if (!event.start) return false;
    return new Date(event.start as string | number | Date) >= now;
  });

  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      locale={i18next.language}
      initialView="timeGridDay"
      allDaySlot={false}
      nowIndicator={true}
      events={filteredEvents}
      initialDate={date}
      eventClick={handleEventClick}
      scrollTime={now.toTimeString().slice(0, 8)}
      eventMinHeight={40}
      slotMinTime="00:00:00"
      slotMaxTime="24:00:00"
      height="clamp(400px, 500px, 600px)"
    />
  );
};

export default WorkpodCalendar;
