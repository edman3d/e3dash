/**
 * Utility functions for handling timezone conversions
 */

/**
 * Gets the current date-time string in local timezone
 * Format: YYYY-MM-DDTHH:MM (for datetime-local input)
 */
export const getLocalDateTimeString = (): string => {
  const now = new Date();
  
  // Format as YYYY-MM-DDTHH:MM for datetime-local input
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Converts a local datetime string to UTC ISO string for storage
 */
export const toUTCISOString = (localDateTimeString: string): string => {
  const date = new Date(localDateTimeString);
  return date.toISOString();
};

/**
 * Converts a UTC date string to local timezone display format
 */
export const formatToLocal = (dateString: string): string => {
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

// Keep backward compatibility
export const getESTDateTimeString = getLocalDateTimeString;
export const formatToEST = formatToLocal;
