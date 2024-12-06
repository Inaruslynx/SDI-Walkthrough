export class CreateLogDto {
  data: {
    walkthrough: string;
    data: {
      dataPoint: string;
      value: string | number | boolean;
    }[];
  };
}
