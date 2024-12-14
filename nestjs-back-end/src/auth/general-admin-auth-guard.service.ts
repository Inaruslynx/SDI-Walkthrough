import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClerkUser } from '../schemas/users.schema';
import { getAuth } from '@clerk/express'; // Adjust the path to your ClerkUser model

@Injectable()
export class GeneralAdminAuthGuard implements CanActivate {
  constructor(
    @InjectModel(ClerkUser.name) private userModel: Model<ClerkUser>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId } = getAuth(request);

    if (!userId) {
      throw new UnauthorizedException(
        'You must be logged in to access this resource.',
      );
    }

    // Fetch the user from MongoDB
    const user = await this.userModel.findOne({ clerkId: userId }).exec();

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    if (!user.admin) {
      throw new UnauthorizedException('You do not have admin privileges.');
    }

    return true;
  }
}
