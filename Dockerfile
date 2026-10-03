FROM node:24-alpine AS base

ENV DIR=/bot
WORKDIR $DIR

RUN corepack enable

FROM base AS pkg

RUN apk update && apk add --no-cache dumb-init


FROM base AS build

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY tsconfig.json seyfert.config.mjs ./
COPY /src ./src

RUN pnpm exec tsc --project tsconfig.json

RUN pnpm exec tsc --project tsconfig.json
RUN echo '{"type":"commonjs"}' > dist/package.json

RUN pnpm prune --prod


FROM base AS production

COPY --from=pkg /usr/bin/dumb-init /usr/bin/dumb-init

COPY --from=build $DIR/node_modules ./node_modules

COPY --from=build $DIR/dist ./dist
COPY --from=build $DIR/package.json ./package.json
COPY --from=build $DIR/seyfert.config.mjs ./seyfert.config.mjs

RUN chown node:node $DIR
RUN apk add --no-cache ffmpeg

ENV NODE_ENV=production
ENV USER=node
USER $USER
ENTRYPOINT ["dumb-init", "node", "dist/index.js"]
