/**
 * Utility function to check if two time slots are the same.
 * @param a start and end times of the first slot
 * @param b start and end times of the second slot
 * @returns {boolean} true if both slots are the same, false otherwise
 * @description This function compares the start and end times of two time slots
 * and returns true if both the start and end times are equal, otherwise false.
 */
const isSameSlot = (
  a: { start: string; end: string },
  b: { start: string; end: string }
): boolean => {
  return (
    new Date(a.start).getTime() === new Date(b.start).getTime() &&
    new Date(a.end).getTime() === new Date(b.end).getTime()
  );
};

export default isSameSlot;
