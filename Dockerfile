ARG NODE_VERSION=25

FROM node:${NODE_VERSION}-alpine AS builder

ARG BUN_VERSION=1.2.13

WORKDIR /app

RUN apk add --no-cache bash curl unzip sed && \
  curl https://bun.sh/install | bash -s -- bun-v${BUN_VERSION}

ENV PATH="${PATH}:/root/.bun/bin"

COPY package.json bun.lock tsconfig.json vite.config.ts ./

RUN bun install --frozen-lockfile

COPY . .

RUN sed -i 's/basePath: .*,/basePath: "",/' ./vite.config.ts

RUN bun run build

FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
