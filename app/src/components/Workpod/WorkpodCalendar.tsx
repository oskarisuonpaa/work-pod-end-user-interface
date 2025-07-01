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

/**
 * Displays a FullCalendar component for managing time slots.
 * It allows users to select available time slots, view events, and manage reservations.
 * @component
 * @param {CalendarProps} param0 - The component props containing events, date, selected slots, and a callback for slot changes.
 * @param {EventInput[]} param0.events - The list of events to display in the calendar.
 * @param {string} [param0.date] - The initial date to display in the calendar (optional).
 * @param {CalendarEvent[]} param0.selectedSlots - The currently selected time slots in the calendar.
 * @param {(slots: CalendarEvent[]) => void} param0
 * @returns FullCalendar component with time grid view for managing workpod reservations.
 * @description This component renders a calendar that allows users to select time slots for reservations.
 * It handles event clicks to toggle selection of time slots and updates the selected slots accordingly.
 * It also filters out past slots and allows only free slots or the user's own slots to be
 */
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
