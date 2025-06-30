import type { CalendarEvent, WorkpodWithEvents } from "@types";
import { getWorkpodAvailability } from "./getWorkpodAvailability";

/**
 * Update the availability status of all work pods
 * @param prevPods - The previous state of the work pods
 * @param results - The new calendar events for each work pod
 * @param date - The date to check availability for
 * @returns The updated state of the work pods
 */
const updateAllWorkPods = (
  prevPods: WorkpodWithEvents[],
  results: ({ data: CalendarEvent[]; idx: number } | null)[],
  date: Date
) => {
  let newPods = [...prevPods];
  results?.forEach((result) => {
    if (result) {
      newPods = updateWorkPods(newPods, result.data, date, result.idx);
    }
  });
  return newPods;
};

/**
 * Update the availability status of a specific work pod
 * @param prevPods - The previous state of the work pods
 * @param data - The new calendar events for the work pod
 * @param date - The date to check availability for
 * @param idx - The index of the work pod to update
 * @returns The updated state of the work pods
 */
const updateWorkPods = (
  prevPods: WorkpodWithEvents[],
  data: CalendarEvent[],
  date: Date,
  idx: number
) => {
  const newPods = [...prevPods];
  const availability = getWorkpodAvailability(data, date);

  newPods[idx] = {
    ...newPods[idx],
    ...availability,
    events: data,
  };
  return newPods;
};

export default updateAllWorkPods;
