export interface IScheduledClosing {
  date: Date;
  reason: string;
  allDay: boolean;
  fromTime?: string;
  toTime?: string;
}
