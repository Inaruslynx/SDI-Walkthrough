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
}

export interface Area {
  _id?: string;
  name: string;
  parentType: 'area' | 'walkthrough';
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

export interface Walkthrough {
  name: string;
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
