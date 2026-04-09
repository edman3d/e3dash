/**
 * Utility functions for handling timezone conversions
 */

/**
 * Gets the current date-time string in EST timezone (UTC-5)
 * Format: YYYY-MM-DDTHH:MM (for datetime-local input)
 */
export const getESTDateTimeString = (): string => {
  const now = new Date();
  // Use America/New_York timezone which handles EST/EDT automatically
  const estTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  
  // Format as YYYY-MM-DDTHH:MM for datetime-local input
  const year = estTime.getFullYear();
  const month = String(estTime.getMonth() + 1).padStart(2, '0');
  const day = String(estTime.getDate()).padStart(2, '0');
  const hours = String(estTime.getHours()).padStart(2, '0');
  const minutes = String(estTime.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Converts a UTC date string to EST timezone display format
 */
export const formatToEST = (dateString: string): string => {
  const date = new Date(dateString);
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York'
  });
};
