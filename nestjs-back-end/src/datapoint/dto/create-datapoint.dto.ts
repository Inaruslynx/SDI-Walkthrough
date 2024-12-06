export class CreateDatapointDto {
  text: string;
  name?: string;
  type: 'string' | 'number' | 'boolean';
  min?: number;
  max?: number;
  unit?: string;
  choices?: string[];
  parentArea: string;
  parentWalkthrough: string;
  orgId: string;
}
