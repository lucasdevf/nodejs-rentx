interface IDateProvider {
  diffInHours(start_date: Date, end_date: Date): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
  diffInDays(start_date: Date, end_date: Date): number;
}

export { IDateProvider };
