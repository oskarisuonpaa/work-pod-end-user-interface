/**
 * Parses a date string and formats it to "dd.mm.yyyy" in Finnish locale.
 * @param dateString - A date string in ISO format (e.g., "2023-10-01T12:00:00Z").
 * @return {string} The formatted date string in "dd.mm.yyyy" format.
 * @description Parses a date string and formats it to "dd.mm.yyyy" in Finnish locale.
 */
export const parseDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return date.toLocaleString("fi-FI", options);
};

/**
 * Parses a date string and formats it to "HH:mm" in Finnish locale.
 * @param dateString - A date string in ISO format (e.g., "2023-10-01T12:00:00Z").
 * @return {string} The formatted time string in "HH:mm" format.
 * @description Parses a date string and formats it to "HH:mm" in Finnish locale.
 */
export const parseTime = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleString("fi-FI", options);
};
