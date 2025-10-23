## Version 1.0 of the Front end is complete.

Currently, to successfully install this app you will need to:

- Create a folder the following folder: C:\walkthrough or change the installService.js and uninstallService.js later on
- Clone this repository into whatever folder you decided above
- Create a [Clerk](https://clerk.com/) account and create an app
- When setting up Clerk configure as follows:
  - disable Email Address and Username
  - Require Name
  - Use Microsoft as a SSO connection
- For Clerk, you will need your apps API keys:

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
```

- Install [MongoDB](https://www.mongodb.com/try/download/community), [MongoShell](https://www.mongodb.com/try/download/shell), and follow the [setup](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/#install-mongodb-community-edition)
- MongoDB will need a user to write to a database called `Logs` make sure to save these for later [User Creation Instructions](https://www.mongodb.com/docs/manual/core/security-users/). For example, have an admin accoount and a user DataEntry that only has `readWrite` access to `Logs`
- [Node](https://nodejs.org/en) installed and restart OS
- Open admin level command line and in the main folder with `nestjs-back-end` and `next-front-end` run:

```bash
corepack enable pnpm
corepack use pnpm@latest
pnpm install -r -w
```

- Install nestjs-back-end:
  - You will need the MongoDB user name and password you created earlier
  - Create a `.env` file in `nestjs-back-end` and create the following keys:

```text
DOMAIN=<address of Next server> ie http://<ip-address or server name>/
CLERK_PUBLISHABLE_KEY=key(starts with pk)
CLERK_SECRET_KEY=key(starts with sk)
MONGO_URI="mongodb://<user>:<password>@127.0.0.1:27017/?authMechanism=DEFAULT"
MONGO_DEBUG=false
```

- In the next-front-end folder create a `.env.local` file
- In the `.env.local` the following variables need to be created:

```text
NEXT_PUBLIC_API_URL=http://<server name or ip address>:8000/api/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (starts with pk)
CLERK_SECRET_KEY (starts with sk)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/back-end/sign-up
```

- In an admin commandline console, navigate the nestjs-back-end folder:

```bash
pnpm build
```

- Copy the `.env` into dist then in admin console:

```bash
node installService.js
```

- Navigate to next-front-end and run the doploy.ps1 powershell script. I recommend looking through it and changing it how you like.

- Server should be up and running
