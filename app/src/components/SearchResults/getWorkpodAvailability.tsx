import {
  differenceInMinutes,
  isWithinInterval,
  setHours,
  setMinutes,
  add,
} from "date-fns";
import type { CalendarEvent } from "@types";

export interface WorkpodAvailability {
  isReserved: boolean;
  freeFor: number;
  freeUntil: Date | null;
  reservedFor: number;
  reservedUntil: Date | null;
}

export function getWorkpodAvailability(
  events: CalendarEvent[],
  date: Date
): WorkpodAvailability {
  let freeUntil = null;
  let freeFor = 0;
  let reservedUntil = null;
  let reservedFor = 0;
  const dateMinute = add(new Date(date), { minutes: 1 }); // interval check returns true if reservation ends at 15:00 and date is 15:00

  if (events.length === 0) {
    // no data means the pod is free for the rest of the day
    // calculate freeFor the rest of the work day
    const dateEnd = setHours(setMinutes(new Date(date), 59), 23);
    freeFor = differenceInMinutes(dateEnd, date);
    freeUntil = dateEnd;
    return {
      isReserved: false,
      freeFor,
      freeUntil,
      reservedUntil: null,
      reservedFor: 0,
    };
  }
  // check if the selected date is within the interval of the event
  const isReserved = events.some((event) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    return isWithinInterval(dateMinute, { start: startDate, end: endDate });
  });

  // sort the events by start time so we can find the next reservation
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  if (!isReserved) {
    //if isReserved is false, calculate freeFor
    const nextReservation = sortedEvents.find(
      (event) => new Date(event.start) > date
    );
    //check for the next reservation
    if (nextReservation) {
      // there is an event, free until the start of the event
      const startDate = new Date(nextReservation.start);
      freeFor = differenceInMinutes(startDate, date);
      freeUntil = startDate;
    } else {
      // no reservations after the selected date, free for the rest of the day
      const dateEnd = setHours(setMinutes(new Date(date), 59), 23);
      freeFor = differenceInMinutes(dateEnd, date);
      freeUntil = dateEnd;
    }
  } else {
    //isReserved
    // need to use sortedEvents, check the end time of the first event
    // then check whether the next event starts right away
    // if yes, then need to check when that event ends... etc
    const firstEvent = sortedEvents[0];
    let endDate = new Date(firstEvent.end);
    reservedUntil = endDate;
    if (endDate > date && sortedEvents.length > 1) {
      for (let i = 1; i < sortedEvents.length; i++) {
        const nextEvent = sortedEvents[i];
        const nextStartDate = new Date(nextEvent.start);
        if (nextStartDate > endDate) {
          // found the next event that starts after the current event ends
          // but doesn't start right away so the pod will be available for a bit
          reservedUntil = endDate;
          break;
        }
        endDate = new Date(nextEvent.end);
      }
      reservedUntil = endDate;
    }
    reservedFor = differenceInMinutes(reservedUntil, date);
  }

  return { isReserved, freeFor, freeUntil, reservedFor, reservedUntil };
}
