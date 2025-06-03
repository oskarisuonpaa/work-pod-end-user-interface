import type { DataItem, WorkpodWithEvents } from "@types";
import {
  differenceInMinutes,
  isWithinInterval,
  setHours,
  setMinutes,
  add,
} from "date-fns";

const updateAllWorkPods = (
  prevPods: WorkpodWithEvents[],
  results: ({ data: DataItem[]; idx: number } | null)[],
  date: Date
) => {
  let newPods = [...prevPods];
  results?.forEach(result => {
    if (result) {
      newPods = updateWorkPods(newPods, result.data, date, result.idx);
    }
  });
  return newPods;
};

const updateWorkPods = (
  prevPods: WorkpodWithEvents[],
  data: DataItem[],
  date: Date,
  idx: number
) => {
  const newPods = [...prevPods];
  let freeUntil = null;
  const dateMinute = add(date, { minutes: 1 }); // interval check returns true if reservation ends at 15:00 and date is 15:00

  console.log(data);
  if (data.length === 0) {
    newPods[idx].isReserved = false;
    // calculate freefor the rest of the work day
    let dateEnd = date;
    dateEnd = setHours(dateEnd, 23);
    dateEnd = setMinutes(dateEnd, 59);
    newPods[idx].freeFor = differenceInMinutes(dateEnd, date);
    freeUntil = dateEnd;
    newPods[idx] = { ...newPods[idx], freeUntil, events: data };

    return newPods;
  }
  // check if the selected date is within the interval of the event
  const isReserved = data.some((event: { start: string; end: string }) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    return isWithinInterval(dateMinute, {
      start: startDate,
      end: endDate,
    });
  });
  let freeFor = 0;
  // sort the events by start time
  const sortedEvents = [...data].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
  //if isReserved is false, calculate freeFor
  if (!isReserved) {
    //check for the next reservation
    const nextReservation = sortedEvents.find((event: { start: string }) => {
      const startDate = new Date(event.start);
      return startDate > date;
    });

    if (nextReservation) {
      const startDate = new Date(nextReservation.start);
      freeFor = differenceInMinutes(startDate, date);
      freeUntil = startDate;
    } else {
      // no reservations after the selected date, free for the rest of the day
      let dateEnd = date;
      dateEnd = setHours(dateEnd, 23);
      dateEnd = setMinutes(dateEnd, 59);
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
    let reservedUntil = new Date(firstEvent.end);
    if (endDate > date) {
      if (sortedEvents.length > 1) {
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
    }
    newPods[idx].reservedUntil = reservedUntil;
    newPods[idx].reservedFor = differenceInMinutes(date, reservedUntil);
  }

  newPods[idx] = {
    ...newPods[idx],
    isReserved,
    freeFor,
    freeUntil,
    events: data,
  };
  return newPods;
};

export default updateAllWorkPods;
