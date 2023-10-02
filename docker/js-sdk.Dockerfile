# ▼ Export
FROM node:alpine as EXPORTER
WORKDIR /app
RUN apk update && yarn global add turbo
COPY . .
RUN turbo prune --scope @kitchen-table/js-sdk --docker

# ▼ Build sdk
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
RUN pnpm turbo run build --filter=@kitchen-table/js-sdk

# ▼ Copy sdk
COPY --from=BUILDER /app .
# apps/js-sdk/dist/@kitchen-table/js-sdk.es.js

