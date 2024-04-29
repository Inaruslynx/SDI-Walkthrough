export {};

export type Roles =
  | "org:admin"
  | "org:member"
  | "org:electrical-admins"
  | "org:mechanical-admins"
  | "org:operations-admins"
  | "org:electrical"
  | "org:mechanical"
  | "org:operations";

declare global {
  interface CustomJwtSessionClaims {
    metadate: {
      role?:
        | "org:admin"
        | "org:member"
        | "org:electrical-admins"
        | "org:mechanical-admins"
        | "org:operations-admins"
        | "org:electrical"
        | "org:mechanical"
        | "org:operations";
    };
  }
  interface ClerkAuthorization {
    permission: "org:walkthrough:create";
    role:
      | "org:admin"
      | "org:member"
      | "org:electrical-admins"
      | "org:mechanical-admins"
      | "org:operations-admins"
      | "org:electrical"
      | "org:mechanical"
      | "org:operations";
  }
}
