import { ScheduleItem } from '../types';

/**
 * Converts a "HH:mm" string to minutes from midnight.
 */
export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Gets the current time as total minutes from midnight.
 */
export const getCurrentMinutes = (date: Date = new Date()): number => {
  return date.getHours() * 60 + date.getMinutes();
};

/**
 * Formats a Date object to "HH:mm:ss"
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour12: true, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
};

/**
 * Determines the current active schedule item based on current time.
 */
export const getCurrentScheduleItem = (
  items: ScheduleItem[], 
  currentDate: Date
): ScheduleItem | null => {
  const currentMinutes = getCurrentMinutes(currentDate);

  return items.find(item => {
    const start = timeToMinutes(item.startTime);
    const end = timeToMinutes(item.endTime);

    // Handle overnight case (e.g. 22:00 to 05:00)
    if (end < start) {
      return currentMinutes >= start || currentMinutes < end;
    }

    return currentMinutes >= start && currentMinutes < end;
  });
};

/**
 * Determines if we just hit the start time (to trigger alarm).
 * Returns true if current HH:MM matches start HH:MM and seconds are < 2 (to avoid missing tick).
 */
export const isExactStartTime = (targetTime: string, currentDate: Date): boolean => {
  const [targetH, targetM] = targetTime.split(':').map(Number);
  const currentH = currentDate.getHours();
  const currentM = currentDate.getMinutes();
  const currentS = currentDate.getSeconds();

  // Trigger window is first 2 seconds of the minute
  return currentH === targetH && currentM === targetM && currentS < 2;
};