export class CreateLogDto {
  walkthrough: string;
  data: {
    dataPoint: string;
    value: string | number | boolean;
  }[];
}
