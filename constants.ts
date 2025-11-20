import { ScheduleItem } from './types';

export const SCHEDULE_DATA: ScheduleItem[] = [
  {
    id: '1',
    startTime: '05:00',
    endTime: '07:30',
    displayTime: '05:00 - 07:30',
    activity: 'STUDY (MATHS)',
    duration: '02:30',
    details: '05:00-07:30 + 08:00-08:45',
    type: 'study'
  },
  {
    id: '2',
    startTime: '07:30',
    endTime: '08:00',
    displayTime: '07:30 - 08:00',
    activity: 'Bathroom + Brush',
    duration: '00:30',
    type: 'routine'
  },
  {
    id: '3',
    startTime: '08:00',
    endTime: '10:30',
    displayTime: '08:00 - 10:30',
    activity: 'STUDY (PHYSICS)',
    duration: '02:30',
    details: '08:45-10:30 + 11:30-01:00',
    type: 'study'
  },
  {
    id: '4',
    startTime: '10:30',
    endTime: '11:00',
    displayTime: '10:30 - 11:00',
    activity: 'Meal + Bath',
    duration: '00:30',
    details: '30±15 + 15ext',
    type: 'routine'
  },
  {
    id: '5',
    startTime: '11:00',
    endTime: '11:30',
    displayTime: '11:00 - 11:30',
    activity: 'Travel + Prep Library',
    duration: '00:30',
    type: 'routine'
  },
  {
    id: '6',
    startTime: '11:30',
    endTime: '14:30',
    displayTime: '11:30 - 02:30',
    activity: 'STUDY (CHEMISTRY)',
    duration: '03:00',
    details: '01:00-02:30 + 02:50-04:20',
    type: 'study'
  },
  {
    id: '7',
    startTime: '14:30',
    endTime: '14:45',
    displayTime: '02:30 - 02:45',
    activity: 'Break (Nap)',
    duration: '00:20',
    type: 'break'
  },
  {
    id: '8',
    startTime: '14:50',
    endTime: '16:20',
    displayTime: '02:50 - 04:20',
    activity: 'STUDY',
    duration: '01:30',
    type: 'study'
  },
  {
    id: '9',
    startTime: '16:20',
    endTime: '16:30',
    displayTime: '04:20 - 04:30',
    activity: 'Packaging',
    duration: '00:10',
    type: 'routine'
  },
  {
    id: '10',
    startTime: '16:30',
    endTime: '16:45',
    displayTime: '04:30 - 04:45',
    activity: 'Travel',
    duration: '00:15',
    type: 'routine'
  },
  {
    id: '11',
    startTime: '16:45',
    endTime: '17:30',
    displayTime: '04:45 - 05:30',
    activity: 'Fresh + Meal',
    duration: '00:45',
    type: 'routine'
  },
  {
    id: '12',
    startTime: '17:30',
    endTime: '20:00',
    displayTime: '05:30 - 08:00',
    activity: 'STUDY (ENG / PE)',
    duration: '02:30',
    details: '06:00-08:00 + 08:30-09:30',
    type: 'study'
  },
  {
    id: '13',
    startTime: '20:00',
    endTime: '20:30',
    displayTime: '08:00 - 08:30',
    activity: 'Dinner',
    duration: '00:30',
    type: 'routine'
  },
  {
    id: '14',
    startTime: '20:30',
    endTime: '21:45',
    displayTime: '08:30 - 09:45',
    activity: 'STUDY',
    duration: '01:15',
    type: 'study'
  },
  {
    id: '15',
    startTime: '22:00',
    endTime: '05:00',
    displayTime: '10:00 - 05:00',
    activity: 'SLEEP',
    duration: '07:00',
    type: 'sleep'
  }
];