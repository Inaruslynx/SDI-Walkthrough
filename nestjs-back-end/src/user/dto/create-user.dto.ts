import { Department } from 'src/schemas/departments.schema';
import { Theme } from '../../schemas/users.schema';
import { Walkthrough } from '../../schemas/walkthroughs.schema';

export class CreateUserDto {
  email: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  assignedWalkthroughs: Walkthrough[];
  department: Department;
  admin: boolean;
  type: Theme;
  enabled: boolean;
}
