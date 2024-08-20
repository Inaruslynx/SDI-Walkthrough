export interface GraphData {
  labels: Date[];
  datasets: [
    {
      data: number[];
    },
  ];
}

export interface DataPoint {
  _id?: string;
  text: string;
  type: "number" | "string" | "boolean";
  value?: number | string | boolean;
  unit?: string;
  min?: number;
  max?: number;
  choices?: string[];
  parentArea: string;
  parentWalkthrough: string;
  isNew?: boolean;
}

export interface Area {
  _id?: string;
  name: string;
  parentType: "area" | "walkthrough";
  parentWalkthrough: string;
  parentArea?: string;
  areas: Area[];
  dataPoints: DataPoint[];
  isNew?: boolean;
}

export interface WalkthroughData {
  id: string;
  name: string;
}

export interface Walkthroughs {
  walkthroughs: WalkthroughData[];
}

export enum PeriodicityOptions {
  PerShift = "Per Shift",
  Daily = "Daily",
  PerSwing = "Per Swing",
  Weekly = "Weekly",
  BiWeekly = "Bi-Weekly",
  Monthly = "Monthly",
}

export enum WeeklyOptions {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}

export enum PerSwingOptions {
  First = "First Day",
  Second = "Second Day",
  Third = "Third Day",
  Fourth = "Fourth Day",
}

export interface Walkthrough {
  name: string;
  periodicity?: PeriodicityOptions;
  weekly?: WeeklyOptions;
  perSwing?: PerSwingOptions;
  department: string;
  data: Array<Area>;
}

export interface createWalkthroughResponse {
  name: string;
}

export interface Department {
  name: string;
  walkthroughs: Walkthrough[];
}

export interface Log {
  walkthrough: string;
  data: {
    dataPoint: string;
    value: string | number | boolean;
  }[];
}
