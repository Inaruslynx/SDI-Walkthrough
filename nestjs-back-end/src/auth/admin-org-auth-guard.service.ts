import { createClerkClient, getAuth } from '@clerk/express';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class AdminOrgAuthGuard implements CanActivate {
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
    const orgId =
      request.body?.orgId ||
      request.query?.orgId ||
      request.headers['x-org-id'];
    // Check if `orgId` is present
    // this.logger.log('orgId:', orgId);
    if (!orgId) {
      throw new ForbiddenException('Organization ID is required');
    }
    try {
      // this.logger.log('Before authenticate');
      // const result = await clerkClient.authenticateRequest(request); //.cookies.__session
      if (userId) {
        const usersOrgs = await clerkClient.users.getOrganizationMembershipList(
          {
            userId,
          },
        );
        const isAdminForOrg = usersOrgs.data.some(
          (membership) =>
            membership.organization.id === orgId &&
            membership.role === 'org:admin',
        );
        // console.log(`userOrgs: ${usersOrgs}`);
        // this.logger.log(`userOrgs: ${JSON.stringify(usersOrgs, null, 2)}`);
        if (isAdminForOrg) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }
}
