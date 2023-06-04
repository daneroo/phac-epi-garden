FROM node:18-alpine AS base
# name of the app directory: /apps/${APP_NAME} and package: @phac/${APP_NAME}
# this is set in all build stages
# it is meant to be injected from docker-compose file
ARG APP_NAME=epi-docs
RUN echo "***** in base APP_NAME=${APP_NAME}"

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update


FROM base AS builder
# Set working directory
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm --version 

COPY . .
RUN pnpx turbo prune --scope=@phac/${APP_NAME} --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm --version 

# First install the dependencies (as they change less often)
COPY .gitignore ./
COPY --from=builder /app/out/json/ ./
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm i --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ ./
COPY turbo.json tsconfig.json ./

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo run build --filter=@phac/${APP_NAME}...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/${APP_NAME}/next.config.js ./
COPY --from=installer /app/apps/${APP_NAME}/package.json ./

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
#  requires next.congig.js: { output: "standalone" }
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

CMD node apps/${APP_NAME}/server.js