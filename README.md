## Version 1.0 of the Front end is complete.

Currently, to successfully install this app you will need to:

- Clone this repository
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

- Install [MongoDB](https://www.mongodb.com/try/download/community) and follow the [setup](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/#install-mongodb-community-edition)
- MongoDB will need a user to write to a database called `Logs` make sure to save these for later
- [Node](https://nodejs.org/en) installed and restart OS
- Open command line and in the main folder with `nestjs-back-end` and `next-front-end` run:

```bash
corepack enable pnpm
corepack use pnpm@latest
pnpm install -r -w
```

- Install nestjs-back-end:
  - You will need the MongoDB user name and password you created earlier
  - Create a `.env` file in `nestjs-back-end` and create the following keys:

```text
CLERK_PUBLISHABLE_KEY (starts with pk)
CLERK_SECRET_KEY (starts with sk)
MONGO_URI="mongodb://<user>:<password>@127.0.0.1:27017/?authMechanism=DEFAULT"
MONGO_DEBUG=false
```

- In the next-front-end folder create a `.env.local` file
- In the `.env.local` the following variables need to be created:

```text
NEXT_PUBLIC_API_URL=http://<server ip or address>:8000/api/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (starts with pk)
CLERK_SECRET_KEY (starts with sk)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/back-end/sign-up
```

- In a console, navigate the nestjs-back-end folder and run:

```bash
pnpm build
```

- Copy the `.env` into dist then in console:

```bash
node installService.js
```

- Navigate to next-front-end and run:

```bash
pnpm build
```

- Next.js requires a couple of things to run. Look at `.things-to-drag-into-next.md` and copy those folders as described then in a console:

```bash
node installService.js
```

- Server should be up and running
