import {
    differenceInMinutes,
    isWithinInterval,
    setHours,
    setMinutes,
    add,
} from "date-fns";
import type { WorkPod } from "@auth/types.ts";

const updateWorkPods = (prevPods : WorkPod[], data: any, date: Date, idx: number, workpodId: string) => {
    const newPods = [...prevPods];
    let freeUntil = null;
            const dateMinute = add(date, { minutes: 1 }); // interval check returns true if reservation ends at 15:00 and date is 15:00
            

    if (data.length === 0) {
        console.log("No reservations found for", workpodId);
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
    console.log("Reservations found for", workpodId, data);
    // check if the selected date is within the interval of the event
    const isReserved = data.some(
        (event: { start: string; end: string }) => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            return isWithinInterval(dateMinute, {
                start: startDate,
                end: endDate,
            });
        }
    );
    let freeFor = 0;
    const sortedEvents = [...data].sort(
        (a, b) =>
            new Date(b.start).getTime() - new Date(a.start).getTime()
    );
    //if isReserved is false, calculate freeFor
    if (!isReserved) {
        //check for the next reservation
        const nextReservation = sortedEvents.find(
            (event: { start: string }) => {
                const startDate = new Date(event.start);
                return startDate > date;
            }
        );

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
            }
        }
        newPods[idx].reservedUntil = reservedUntil;
    }

    newPods[idx] = {
        ...newPods[idx],
        isReserved,
        freeFor,
        freeUntil,
        events: data,
    };
    return newPods;
}


export default updateWorkPods;