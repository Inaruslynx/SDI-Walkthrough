import type { AxiosResponse } from 'axios';

export interface GraphData {
    labels: Date[];
    datasets: [
      {
        data: number[];
      },
    ];
}

export type WalkthroughsResponse = AxiosResponse<{
  walkthroughs: string[];
}>;

export interface Walkthrough {
  name: string;
}

export interface Department {
  name: string;
  walkthroughs: Walkthrough[];
}