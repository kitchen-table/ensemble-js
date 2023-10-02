# ▼ Export application
FROM node:alpine as EXPORTER
WORKDIR /app
RUN apk update && yarn global add turbo
COPY . .
RUN turbo prune --scope @kitchen-table/backend --docker

# ▼ Build application
FROM node:alpine as BUILDER
WORKDIR /app
RUN apk update && apk add g++ make py3-pip && yarn global add pnpm

COPY --from=EXPORTER /app/out/full/.gitignore ./.gitignore
COPY --from=EXPORTER /app/out/full/turbo.json ./turbo.json
COPY --from=EXPORTER /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=EXPORTER /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm fetch

COPY --from=EXPORTER /app/out/full/ .
RUN pnpm install -r --offline --ignore-scripts
RUN pnpm turbo run build --filter=@kitchen-table/backend

# ▼ Run application
FROM node:alpine as RUNNER
WORKDIR /app

# # Don't run production as root
RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app
USER app

COPY --from=BUILDER /app .
CMD ["node", "apps/backend/dist/main.js"]

