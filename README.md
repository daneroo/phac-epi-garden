# phac-epi-garden

Monorepo based on [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo)

## TODO

- [ ] <https://realfavicongenerator.net/>
- [ ] people and role (search)
  - [useInfiniteQuery](https://trpc.io/docs/reactjs/useinfinitequery)
  - <https://dev.to/esponges/react-query-infinite-query-and-t3-stack-34nb>
- [ ] people/id and role/id with details
- [ ] [prisma+Yoga+graphQl](https://www.prisma.io/blog/fullstack-nextjs-graphql-prisma-oklidw1rhw)
- [ ] remove nextjs from repo
- [ ] feature branches/pr's not deployed correctly (neon branch?)
- Refactor database dump/usernames, etc
- Other services from t3 tutorial: <https://www.youtube.com/watch?v=YkOSUVzOAA4>
  - [Clerk](https://clerk.com/) - for Auth + User Management
  - Axiom
  - Changing stack: <https://www.youtube.com/watch?v=hgglCqAXHuE>
    - [shadcdn/ui](https://ui.shadcn.com/)
- `----- DONE (for now) -----`
- [x] [Flowbite](https://flowbite.com/)
- [x] create `apps/docs`
- [x] orgs a org-with-tiers
- [x] clone `apps/nextjs -> apps/epi-t3` (adjust vercel build)
  - [x] deploy with neon (for prod)
- [x] rename @acme to @phac
  - [x] lint and test
- [x] deploy to vercel
- [x] pull latest from <https://github.com/ToferC/epi_center>
  - [x] pull latest
  - [x] run seed again
    - migrate and compare
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

See [docs on `pg_dump` on neon](https://neon.tech/docs/import/import-from-postgres)

```bash
cd packages/db
# bring up an empty database (phac-epi_center)
# docker compose down; sleep 2; docker compose up -d db
pnpm db:generate
pnpm db:push
pnpm db:restore # too slow for remote
```

`pg_dump && pg_restore`: to install these on MacOS, `brew install libpq`

```bash
#  single sql file
pg_dump "postgresql://christopherallison:12345@localhost:5432/people_data_api" --no-owner --no-acl > db_backup-noacl.sql

# wipe the database and restore
psql "postgresql://christopherallison:12345@localhost:5432/people_data_api" < db_backup-noacl.sql
psql $DIRECT_URL < db_backup-noacl.sql

# neon suggested format: --file=dumpfile.bak -Fc -Z 6 -v
pg_dump "postgresql://christopherallison:12345@localhost:5432/people_data_api" --file=dumpfile.bak -Fc -Z 6 -v

# tar format:
pg_dump -F t "postgresql://christopherallison:12345@localhost:5432/people_data_api" > db_backup.tar

# Drop all on neon target
psql $DIRECT_URL -c "
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;"
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

```bash
DISCORD_CLIENT_ID=... # (same as local)
DISCORD_CLIENT_SECRET=... # (same as local)
NEXTAUTH_URL=https://t3.epi.phac.v.imetrical.com/
NEXTAUTH_SECRET=`openssl rand -base64 32` # newly generated for prod
```

### turbo cache

- `npx turbo login`
- `npx turbo link`: to undo `npx turbo unlink`
- Link remote caching on vercel/github: <https://turbo.build/repo/docs/ci/github-actions>
  - TURBO_TOKEN, is a secret in GitHub actions secrets
  - TURBO_TEAM=daneroo, is a variable in GitHub actions variables
- To verify, delete your local Turborepo cache with:
  - `rm -rf ./node_modules/.cache/turbo`
- [ ] sign remote cache: <https://turbo.build/repo/docs/core-concepts/remote-caching#artifact-integrity-and-authenticity-verification>

## Styling with Tailwind

Also consider flowbite

- [Tailwind Cheat Sheet](https://flowbite.com/tools/tailwind-cheat-sheet/)
- [shadcdn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

## References

The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).

- [Tailwind Cheat Sheet](https://flowbite.com/tools/tailwind-cheat-sheet/)
- [shadcdn/ui](https://ui.shadcn.com/)
- [jumr.dev blog post on T3 in Turborepo](https://jumr.dev/blog/t3-turbo)
- [Clerk](https://clerk.com/) - for Auth + User Management
