import type { EventClickArg, EventInput } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { SlotSelect, SlotStatus } from "@types";

type CalendarProps = {
  events: EventInput[];
  date: string | undefined;
  onSlotSelect: (slot: SlotSelect) => void;
};

const WorkpodCalendar = ({ events, onSlotSelect, date }: CalendarProps) => {
  const handleEventClick = (info: EventClickArg) => {
    const { start, end, extendedProps, id, title } = info.event;

    if (start && end && extendedProps?.status) {
      const slot: SlotSelect = {
        start: start.toISOString(),
        end: end.toISOString(),
        status: extendedProps.status as SlotStatus,
        title: title || "",
        eventId: id && id !== "" ? id : undefined,
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
      slotDuration="01:00:00"
      slotLabelInterval="01:00"
      height="1242px"
    />
  );
};

export default WorkpodCalendar;
