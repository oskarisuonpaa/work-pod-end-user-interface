import i18next from "i18next";

interface BookedEvent {
  start: string | Date;
  end: string | Date;
}

export function generateFreeSlots(bookedEvents: BookedEvent[]) {
  const startHour = 0;
  const endHour = 24;
  const today = new Date();
  today.setMinutes(0, 0, 0);

  const freeSlots = [];

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const day = new Date(today);
    day.setDate(today.getDate() + dayOffset);

    for (let hour = startHour; hour < endHour; hour++) {
      const start = new Date(day);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(day);
      end.setHours(hour + 1, 0, 0, 0);

      const overlaps = bookedEvents.some((event: BookedEvent) => {
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
          borderColor: "#c3e6cb",
          extendedProps: {
            status: "free",
          },
        });
      }
    }
  }

  return freeSlots;
}

export const isSameSlot = (
  a: { start: string; end: string },
  b: { start: string; end: string }
): boolean => {
  return (
    new Date(a.start).getTime() === new Date(b.start).getTime() &&
    new Date(a.end).getTime() === new Date(b.end).getTime()
  );
};
