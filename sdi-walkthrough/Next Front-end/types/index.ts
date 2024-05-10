// import type { AxiosResponse } from 'axios';

export interface GraphData {
    labels: Date[];
    datasets: [
      {
        data: number[];
      },
    ];
}

export interface DataPoint {
  text: string;
  type: "number" | "text" | "boolean";
  value?: number | string | boolean;
  unit?: string;
  min?: number;
  max?: number;
  choices?: string[];
}

export interface Areas {
  name: string;
  Areas?: Areas[];
  dataPoints?: DataPoint[];
}

// delete at some point as Walkthroughs is replacement
// export type WalkthroughsResponse = AxiosResponse<{
//   walkthroughs: string[];
// }>;

export interface Walkthroughs {
  walkthroughs: string[];
}

export interface Walkthrough {
  name: string;
  department: string;
  areas: Array<Areas>;
}

export interface Department {
  name: string;
  walkthroughs: Walkthrough[];
}