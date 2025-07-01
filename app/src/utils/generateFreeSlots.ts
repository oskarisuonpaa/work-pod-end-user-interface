import type { CalendarEvent } from "@types";
import i18next from "i18next";

const generateFreeSlots = (bookedEvents: CalendarEvent[]) => {
  const startHour = 0;
  const endHour = 24;
  const today = new Date();
  today.setMinutes(0, 0, 0);

  const freeSlots = [];

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const day = new Date(today);
    day.setDate(today.getDate() + dayOffset);

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const start = new Date(day);
        start.setHours(hour, minute, 0, 0);
        const end = new Date(day);
        end.setHours(hour, minute + 30, 0, 0);

        const overlaps = bookedEvents.some((event: CalendarEvent) => {
          const bookedStart = new Date(event.start).getTime();
          const bookedEnd = new Date(event.end).getTime();
          const slotStart = start.getTime();
          const slotEnd = end.getTime();

          return (
            (slotStart >= bookedStart && slotStart < bookedEnd) ||
            (slotEnd > bookedStart && slotEnd <= bookedEnd) ||
            (slotStart <= bookedStart && slotEnd >= bookedEnd)
          );
        });

        if (!overlaps) {
          freeSlots.push({
            title: i18next.t("free"),
            start,
            end,
            backgroundColor: "var(--green)",
            borderColor: "var(--green)",
            extendedProps: {
              status: "free",
            },
          });
        }
      }
    }
  }

  return freeSlots;
};

export default generateFreeSlots;
