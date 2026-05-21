ARG BUN_BASE_IMAGE=oven/bun:latest

FROM ${BUN_BASE_IMAGE} AS dependency-installer
WORKDIR /app
COPY package.json ./
COPY bun.lock ./
RUN bun i --frozen-lockfile --verbose

FROM ${BUN_BASE_IMAGE} AS builder
WORKDIR /app
COPY --from=dependency-installer /app/node_modules ./node_modules
COPY --exclude=nginx.conf . .
RUN bun run build

FROM nginx:mainline-alpine
WORKDIR /var/www/html
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build/ .
EXPOSE 3001