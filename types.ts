export interface ScheduleItem {
  id: string;
  startTime: string; // Format "HH:mm" in 24h
  endTime: string;   // Format "HH:mm" in 24h
  displayTime: string; // Format matching the PDF (e.g., "05:00 - 07:30")
  activity: string;
  duration: string;
  details?: string;
  type: 'study' | 'break' | 'routine' | 'sleep';
}

export interface AppState {
  isActive: boolean;
  currentActivityId: string | null;
  nextActivityId: string | null;
  currentTime: Date;
}