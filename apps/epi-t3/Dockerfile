FROM node:18-alpine AS base
# name of the app directory: /apps/${APP_NAME} and package: @phac/${APP_NAME}
# this is set in all build stages
# it is meant to be injected from docker-compose file
ARG APP_NAME=epi-t3

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update


FROM base AS builder
ARG APP_NAME=epi-t3
# Set working directory
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm --version 

COPY . .
RUN pnpx turbo prune --scope=@phac/${APP_NAME} --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
ARG APP_NAME=epi-t3
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm --version 

# First install the dependencies (as they change less often)
COPY .gitignore ./

# We cannot pre-cache the install with turbo's `/app/out/json/` when we have pnpm linked dependencies
# The impact, is that any change to sources, will invalidate the docker build cache and trigger package installation
# Start of (skipped) Pre-install
# COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# RUN pnpm i --frozen-lockfile
# End of (skipped) Pre-install

COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/full/ .
COPY turbo.json tsconfig.json ./

# Installed i movedd to after we fave full sources.
RUN pnpm i --frozen-lockfile

# Uncomment and use build args to enable remote caching
# If we do this, ensure that the TURBO_* env vars do not survive to the runner stage
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# COPY .env.compose .env
# TODO:(daneroo) Investigate: Need a fake env for the build to work, tried ARG's but didn't work: 
# The only variable need to build is DATABASE_URL, and it just need to look like a url
# from env.mjs: createEnv , in auth and app,..
RUN cat <<EOF > .env
DATABASE_URL=postgres://username:sekret@host/database
NEXTAUTH_URL=http://host:3000
NEXTAUTH_SECRET=xyxyxyxyxyxyxyxyxyxyxyxyxyxyxyxyxyxyxyxyxyx=
DISCORD_CLIENT_ID=9999999999999999999
DISCORD_CLIENT_SECRET=dfdfdfdfdfdfdfdfdfd-dfdf-fdfdfdf
# TURBO_TOKEN=Kxyxyxyxyxyxyxyxyxyxyxyx
# TURBO_TEAM=turboteam
EOF

RUN pnpm turbo run build --filter=@phac/${APP_NAME}...

FROM base AS runner
ARG APP_NAME=epi-t3
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# epi-docs has next.config.js not next.config.mjs
COPY --from=installer /app/apps/${APP_NAME}/next.config.mjs ./
COPY --from=installer /app/apps/${APP_NAME}/package.json ./

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
#  requires next.congig.js: { output: "standalone" }
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

# turn the ARG into ENV runner image
ENV APP_NAME=${APP_NAME}
CMD node apps/${APP_NAME}/server.js