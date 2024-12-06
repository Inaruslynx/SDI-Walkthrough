import { createClerkClient, getAuth } from '@clerk/express';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class LoggedInAuthGuard implements CanActivate {
  private readonly logger = new Logger();

  async canActivate(context: ExecutionContext) {
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    });
    const request = context.switchToHttp().getRequest();
    // this.logger.log('Request body:', request.body);
    // this.logger.log('Request query:', request.query);
    const { userId } = getAuth(request);
    // this.logger.log('this is userId:', userId);
    // this.logger.log('this is the url:', request.url);
    try {
      // this.logger.log('Before authenticate');
      if (userId) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }
}
