import type { DataItem, WorkpodWithEvents } from "@types";
import {getWorkpodAvailability} from "./getWorkpodAvailability";

const updateAllWorkPods = (
  prevPods: WorkpodWithEvents[],
  results: ({ data: DataItem[]; idx: number } | null)[],
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

const updateWorkPods = (
  prevPods: WorkpodWithEvents[],
  data: DataItem[],
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
