export interface IScheduledClosing {
  date: string; // ISO date string (YYYY-MM-DD)
  reason: string;
  allDay: boolean;
  fromTime?: string;
  toTime?: string;
  createdAt?: Date;
}
