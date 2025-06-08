ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS builder

ARG BUN_VERSION=1.2.13

WORKDIR /app

RUN apk add --no-cache bash curl unzip sed && \
  curl https://bun.sh/install | bash -s -- bun-v${BUN_VERSION}

ENV PATH="${PATH}:/root/.bun/bin"

COPY package.json bun.lock tsconfig.json ./

RUN bun install --frozen-lockfile

COPY . .

RUN sed -i '/basePath/d' ./next.config.js

RUN bun run build

ENV NODE_ENV=production

RUN rm -rf node_modules && \
  rm -rf /root/.bun/install/cache/ && \
  bun install --frozen-lockfile --production

RUN curl -sf https://gobinaries.com/tj/node-prune | sh && \
  node-prune

FROM node:${NODE_VERSION}-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

# Copy the bundled code from the builder stage
COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/public ./public

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["npm", "start"]
