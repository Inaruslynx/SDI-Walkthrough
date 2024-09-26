import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor() {
    super({
      authorizationURL: `https://login.microsoftonline.com/${process.env.AZURE_AD_CLIENT_TENANT_ID}/oauth2/v2.0/authorize`,
      tokenURL: `https://login.microsoftonline.com/${process.env.AZURE_AD_CLIENT_TENANT_ID}/oauth2/v2.0/token`,
      clientID: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      callbackURL: 'http://localhost:8000/api/auth/microsoft/callback',
      scope: ['profile', 'email'], // Define scopes
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    try {
      // Process the authenticated user, e.g., store it in the database
      done(null, profile);
    } catch (err) {
      done(err, false);
    }
  }
}
