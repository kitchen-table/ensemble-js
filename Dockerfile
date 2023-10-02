FROM node:alpine as EXPORTER

RUN apk update && yarn global add turbo

COPY . /app
WORKDIR /app

RUN apk add g++ make py3-pip && yarn global add pnpm
RUN pnpm install -r --frozen-lockfile
RUN turbo run build

# # Don't run production as root
RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app
USER app

ENTRYPOINT ["turbo", "run", "start"]
