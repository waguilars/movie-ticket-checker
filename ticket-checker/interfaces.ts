export interface MovieDetail {
  title: string;
  location: string;
  link: string;
  shows: Array<{ title: string, availableSchedules: string[]}>;
}
