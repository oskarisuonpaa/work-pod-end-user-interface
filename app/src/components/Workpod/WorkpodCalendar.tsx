import type { EventClickArg, EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { CalendarEvent, SlotStatus } from "@types";
import i18next from "i18next";

export type CalendarProps = {
  events: EventInput[];
  date?: string;
  selectedSlots: CalendarEvent[];
  onSlotsChange: (slots: CalendarEvent[]) => void;
};

const WorkpodCalendar = ({
  events,
  onSlotsChange,
  date,
  selectedSlots,
}: CalendarProps) => {
  const handleEventClick = (info: EventClickArg) => {
    const { start, end, extendedProps, id, title } = info.event;
    if (!start || !end) return;

    if (end <= new Date()) return; // no past slots

    const slot: CalendarEvent = {
      start: start.toISOString(),
      end: end.toISOString(),
      extendedProps: {
        status: extendedProps.status as SlotStatus,
      },
      title: title || "",
      id: id || undefined,
    };

    // only free slots or your own
    if (slot.extendedProps.status !== "free" && slot.title !== title) {
      return;
    }

    const exists = selectedSlots.find(
      (s) => s.start === slot.start && s.end === slot.end
    );
    const next = exists
      ? selectedSlots.filter(
          (s) => !(s.start === slot.start && s.end === slot.end)
        )
      : [...selectedSlots, slot];

    onSlotsChange(next);
  };

  const now = new Date();
  now.setMinutes(0, 0, 0);
  const upcoming = events.filter(
    (e) => e.start && new Date(e.start as string) >= now
  );

  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      locale={i18next.language}
      initialView="timeGridDay"
      allDaySlot={false}
      nowIndicator
      events={upcoming}
      initialDate={date}
      eventClick={handleEventClick}
      eventClassNames={(arg) => {
        const startISO = arg.event.start?.toISOString();
        const endISO = arg.event.end?.toISOString();
        const isSel = selectedSlots.some(
          (s) => s.start === startISO && s.end === endISO
        );
        return isSel ? ["fc-selected-slot"] : [];
      }}
      scrollTime={now.toTimeString().slice(0, 8)}
      eventMinHeight={40}
      slotMinTime="00:00:00"
      slotMaxTime="24:00:00"
      height="clamp(400px, 500px, 600px)"
      slotDuration="00:30:00"
      slotLabelInterval="00:30:00"
    />
  );
};

export default WorkpodCalendar;
