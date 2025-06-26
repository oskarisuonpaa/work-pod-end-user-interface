import { useState } from "react";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { SelectedSlot, SlotStatus } from "@types";
import i18next from "i18next";
import { useAuth } from "@auth/useAuth";

type CalendarProps = {
  events: EventInput[];
  date?: string;
  onSlotsChange: (slots: SelectedSlot[]) => void;
};

const WorkpodCalendar = ({ events, onSlotsChange, date }: CalendarProps) => {
  const { user } = useAuth();
  const userName = user?.name;

  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);

  const handleEventClick = (info: EventClickArg) => {
    const { start, end, extendedProps, id, title } = info.event;
    if (!start || !end) return;

    // don't allow clicks on past slots
    if (end <= new Date()) return;

    const slotTitle = title || "";
    const slot: SelectedSlot = {
      start: start.toISOString(),
      end: end.toISOString(),
      status: extendedProps.status as SlotStatus,
      title: slotTitle,
      eventId: id || undefined,
    };

    // only allow selecting free slots or slots owned by current user
    if (slot.status !== "free" && slotTitle !== userName) {
      return;
    }

    // toggle in/out of array
    const exists = selectedSlots.find(
      (s) => s.start === slot.start && s.end === slot.end
    );
    const next: SelectedSlot[] = exists
      ? selectedSlots.filter(
          (s) => !(s.start === slot.start && s.end === slot.end)
        )
      : [...selectedSlots, slot];

    setSelectedSlots(next);
    onSlotsChange(next);
  };

  const now = new Date();
  now.setMinutes(0, 0, 0);
  const filteredEvents = events.filter(
    (e) => e.start && new Date(e.start as string) >= now
  );

  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      locale={i18next.language}
      initialView="timeGridDay"
      allDaySlot={false}
      nowIndicator
      events={filteredEvents}
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
    />
  );
};

export default WorkpodCalendar;
