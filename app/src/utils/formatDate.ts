/**
 * Formats a date to ISO string format.
 * @param date - The date to format.
 * @returns the date as an ISO string.
 * @description This function takes a Date object and converts it to an ISO string format.
 */
const formatDate = (date: Date) => {
  return date.toISOString();
};

export default formatDate;
