# phac-epi-garden

Monorepo based on [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo)

## TODO

- [ ] rename @acme to @phac
- [ ] deploy to vercel
- [ ] rename `apps/nextjs -> apps/epi-t3` (adjust vercel build)
  - [ ] deploy with neon (for prod)
- Other services from t3 tutorial: <https://www.youtube.com/watch?v=YkOSUVzOAA4>
  - Changing stack: <https://www.youtube.com/watch?v=hgglCqAXHuE>
- `----- DONE (for now) -----`
- [x] recreate phac-epi_center db to prisma pull
  - [x] get and connect a neon db for production
  - [x] dump (from `packages/db`)
  - [x] seed (from `packages/db`)
- [x] build and run locally
  - [x] setup turbo token for ci and locally
- [x] create git repo
- [x] remove expo
  - [x] remove all references to expo
  - [ ] `.npmrc`: could remove `node-linker=hoisted`
  - [ ] `turbo.json` could remove `build:outputs[] ".expo/**"`

## Usage

```txt
pnpm run db:push db:generate
   Update the Models and generated code: what order?

pnpm run build
  Build all apps and packages

pnpm run dev
  Develop all apps and packages

pnpm run lint
  Lint all apps and packages

pnpm manypkg check
  Not sure, part of ci
```

## Setup

```bash
npx create-turbo@latest -e https://github.com/t3-oss/create-t3-turbo
```

### Introspect from existing epi_center db

```bash
cd packages/db
pnpm db:pull # prisma db pull
# but keep model Post
pnpm db:generate
pnpm db:push
```

### Re-seed the database

```bash
cd packages/db
# bring up an ampty database (phac-epi_center)
# docker compose down; sleep 2; docker compose up -d db
pnpm db:generate
pnpm db:push
pnpm db:restore
```

### Next Auth

- <https://next-auth.js.org/providers/discord>
  - .env:
    - set NEXTAUTH_SECRET=$(openssl rand -base64 32)
    - create application: <https://discord.com/developers/applications>
    - get DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET
    - set at least one redirect url in application
      - dev: <http://localhost:3000/api/auth/callback/discord>
      - prod: redirect url: <https://t3.epi.phac.v.imetrical.com/api/auth/callback/discord>

### neon db

- Docs: <https://neon.tech/docs/guides/prisma>
- Manage your db's at <https://console.neon.tech/app/projects>.

- provision and set vars in vercel/github/local dev or prod?

### deploy to vercel

Deploying to domain: <https://t3.epi.phac.v.imetrical.com/>

Added Vars:

- Added with neon integration in vercel DATABASE_URL=postgres://daneroo:..
  - removed other env vars (DIRECT_URL, PG_HOST,...)
- REMOVED: DIRECT_URL=postgres://daneroo:...
- DISCORD_CLIENT_ID=... (same as local)
- DISCORD_CLIENT_SECRET=... (same as local)
- NEXTAUTH_URL=https://t3.epi.phac.v.imetrical.com/
- NEXTAUTH_SECRET=`openssl rand -base64 32` : newly generated for prod

### turbo cache

- `npx turbo login`
- `npx turbo link`: to undo `npx turbo unlink`
- Link remote caching on vercel/github: <https://turbo.build/repo/docs/ci/github-actions>
  - TURBO_TOKEN, is a secret in GitHub actions secrets
  - TURBO_TEAM=daneroo, is a variable in GitHub actions variables
- To verify, delete your local Turborepo cache with:
  - `rm -rf ./node_modules/.cache/turbo`
- [ ] sign remote cache: <https://turbo.build/repo/docs/core-concepts/remote-caching#artifact-integrity-and-authenticity-verification>
---

## UPSTREAM README create-t3-turbo

<!-- markdownlint-disable MD033 -->
<img width="1758" alt="turbo2" src="https://user-images.githubusercontent.com/51714798/213819392-33e50db9-3e38-4c51-9a22-03abe5e48f3d.png">

## Installation

There are two ways of initializing an app using `create-t3-turbo` starter. You can either use this repository as a template or use Turbo's CLI to init your project:

```bash
npx create-turbo@latest -e https://github.com/t3-oss/create-t3-turbo
```

## About

Ever wondered how to migrate your T3 application into a monorepo? Stop right here! This is the perfect starter repo to get you running with the perfect stack!

It uses [Turborepo](https://turborepo.org/) and contains:

```txt
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ expo
  |   ├─ Expo SDK 48
  |   ├─ React Native using React 18
  |   ├─ Navigation using Expo Router
  |   ├─ Tailwind using Nativewind
  |   └─ Typesafe API calls using tRPC
  └─ next.js
      ├─ Next.js 13
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
 ├─ api
 |   └─ tRPC v10 router definition
 ├─ auth
     └─ authentication using next-auth. **NOTE: Only for Next.js app, not Expo**
 └─ db
     └─ typesafe db-calls using Prisma
```

> In this template, we use `@acme` as a placeholder for package names. As a user, you might want to replace it with your own organization or project name. You can use find-and-replace to change all the instances of `@acme/` to something like `@my-company/` / `@project-name/`.

## FAQ

### Can you include Solito?

No. Solito will not be included in this repo. It is a great tool if you want to share code between your Next.js and Expo app. However, the main purpose of this repo is not the integration between Next.js and Expo - it's the codesplitting of your T3 App into a monorepo, the Expo app is just a bonus example of how you can utilize the monorepo with multiple apps but can just as well be any app such as Vite, Electron, etc.

Integrating Solito into this repo isn't hard, and there are a few [offical templates](https://github.com/nandorojo/solito/tree/master/example-monorepos) by the creators of Solito that you can use as a reference.

### What auth solution should I use instead of Next-Auth.js for Expo?

I've left this kind of open for you to decide. Some options are [Clerk](https://clerk.dev), [Supabase Auth](https://supabase.com/docs/guides/auth), [Firebase Auth](https://firebase.google.com/docs/auth/) or [Auth0](https://auth0.com/docs). Note that if you're dropping the Expo app for something more "browser-like", you can still use Next-Auth.js for those. [See an example in a Plasmo Chrome Extension here](https://github.com/t3-oss/create-t3-turbo/tree/chrome/apps/chrome).

The Clerk.dev team even made an [official template repository](https://github.com/clerkinc/t3-turbo-and-clerk) integrating Clerk.dev with this repo.

During Launch Week 7, Supabase [announced their fork](https://supabase.com/blog/launch-week-7-community-highlights#t3-turbo-x-supabase) of this repo integrating it with their newly announced auth improvements. You can check it out [here](https://github.com/supabase-community/create-t3-turbo).

### Does this pattern leak backend code to my client applications?

No, it does not. The `api` package should only be a production dependency in the Next.js application where it's served. The Expo app, and all other apps you may add in the future, should only add the `api` package as a dev dependency. This lets you have full typesafety in your client applications, while keeping your backend code safe.

If you need to share runtime code between the client and server, such as input validation schemas, you can create a separate `shared` package for this and import on both sides.

## Quick Start

To get it running, follow the steps below:

### Setup dependencies

```diff
# Install dependencies
pnpm i

# In packages/db/prisma update schema.prisma provider to use sqlite
# or use your own database provider
- provider = "postgresql"
+ provider = "sqlite"

# Configure environment variables.
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Prisma schema to your database
pnpm db:push
```

### Configure Expo `dev`-script

#### Use iOS Simulator

1. Make sure you have XCode and XCommand Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator/).
   > **NOTE:** If you just installed XCode, or if you have updated it, you need to open the simulator manually once. Run `npx expo start` in the root dir, and then enter `I` to launch Expo Go. After the manual launch, you can run `pnpm dev` in the root directory.

```diff
+  "dev": "expo start --ios",
```

3. Run `pnpm dev` at the project root folder.

> **TIP:** It might be easier to run each app in separate terminal windows so you get the logs from each app separately. This is also required if you want your terminals to be interactive, e.g. to access the Expo QR code. You can run `pnpm --filter expo dev` and `pnpm --filter nextjs dev` to run each app in a separate terminal window.

#### For Android

1. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator/).
2. Change the `dev` script at `apps/expo/package.json` to open the Android emulator.

```diff
+  "dev": "expo start --android",
```

3. Run `pnpm dev` at the project root folder.

## Deployment

### Next.js

#### Prerequisites

_We do not recommend deploying a SQLite database on serverless environments since the data wouldn't be persisted. I provisioned a quick Postgresql database on [Railway](https://railway.app), but you can of course use any other database provider. Make sure the prisma schema is updated to use the correct database._

**Please note that the Next.js application with tRPC must be deployed in order for the Expo app to communicate with the server in a production environment.**

#### Deploy to Vercel

Let's deploy the Next.js application to [Vercel](https://vercel.com/). If you have ever deployed a Turborepo app there, the steps are quite straightforward. You can also read the [official Turborepo guide](https://vercel.com/docs/concepts/monorepos/turborepo) on deploying to Vercel.

1. Create a new project on Vercel, select the `apps/nextjs` folder as the root directory and apply the following build settings:

<img width="927" alt="Vercel deployment settings" src="https://user-images.githubusercontent.com/11340449/201974887-b6403a32-5570-4ce6-b146-c486c0dbd244.png">

> The install command filters out the expo package and saves a few second (and cache size) of dependency installation. The build command makes us build the application using Turbo.

2. Add your `DATABASE_URL` environment variable.

3. Done! Your app should successfully deploy. Assign your domain and use that instead of `localhost` for the `url` in the Expo app so that your Expo app can communicate with your backend when you are not in development.

### Expo

Deploying your Expo application works slightly differently compared to Next.js on the web. Instead of "deploying" your app online, you need to submit production builds of your app to the app stores, like [Apple App Store](https://www.apple.com/app-store/) and [Google Play](https://play.google.com/store/apps). You can read the full [Distributing your app](https://docs.expo.dev/distribution/introduction/), including best practices, in the Expo docs.

1. Make sure to modify the `getBaseUrl` function to point to your backend's production URL:

https://github.com/t3-oss/create-t3-turbo/blob/656965aff7db271e5e080242c4a3ce4dad5d25f8/apps/expo/src/utils/api.tsx#L20-L37

2. Let's start by setting up [EAS Build](https://docs.expo.dev/build/introduction/), which is short for Expo Application Services. The build service helps you create builds of your app, without requiring a full native development setup. The commands below are a summary of [Creating your first build](https://docs.expo.dev/build/setup/).

   ```bash
   // Install the EAS CLI
   $ pnpm add -g eas-cli

   // Log in with your Expo account
   $ eas login

   // Configure your Expo app
   $ cd apps/expo
   $ eas build:configure
   ```

3. After the initial setup, you can create your first build. You can build for Android and iOS platforms and use different [**eas.json** build profiles](https://docs.expo.dev/build-reference/eas-json/) to create production builds or development, or test builds. Let's make a production build for iOS.

   ```
   $ eas build --platform ios --profile production
   ```

   > If you don't specify the `--profile` flag, EAS uses the `production` profile by default.

4. Now that you have your first production build, you can submit this to the stores. [EAS Submit](https://docs.expo.dev/submit/introduction/) can help you send the build to the stores.

   ```
   $ eas submit --platform ios --latest
   ```

   > You can also combine build and submit in a single command, using `eas build ... --auto-submit`.

5. Before you can get your app in the hands of your users, you'll have to provide additional information to the app stores. This includes screenshots, app information, privacy policies, etc. _While still in preview_, [EAS Metadata](https://docs.expo.dev/eas/metadata/) can help you with most of this information.

6. Once everything is approved, your users can finally enjoy your app. Let's say you spotted a small typo; you'll have to create a new build, submit it to the stores, and wait for approval before you can resolve this issue. In these cases, you can use EAS Update to quickly send a small bugfix to your users without going through this long process. Let's start by setting up EAS Update.

   The steps below summarize the [Getting started with EAS Update](https://docs.expo.dev/eas-update/getting-started/#configure-your-project) guide.

   ```bash
   // Add the `expo-updates` library to your Expo app
   $ cd apps/expo
   $ pnpm expo install expo-updates

   // Configure EAS Update
   $ eas update:configure
   ```

7. Before we can send out updates to your app, you have to create a new build and submit it to the app stores. For every change that includes native APIs, you have to rebuild the app and submit the update to the app stores. See steps 2 and 3.

8. Now that everything is ready for updates, let's create a new update for `production` builds. With the `--auto` flag, EAS Update uses your current git branch name and commit message for this update. See [How EAS Update works](https://docs.expo.dev/eas-update/how-eas-update-works/#publishing-an-update) for more information.

   ```bash
   $ cd apps/expo
   $ eas update --auto
   ```

   > Your OTA (Over The Air) updates must always follow the app store's rules. You can't change your app's primary functionality without getting app store approval. But this is a fast way to update your app for minor changes and bug fixes.

9. Done! Now that you have created your production build, submitted it to the stores, and installed EAS Update, you are ready for anything!

## References

The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).

A [blog post](https://jumr.dev/blog/t3-turbo) where I wrote how to migrate a T3 app into this.
