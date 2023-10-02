FROM node:alpine
RUN apk update && yarn global add turbo && apk add g++ make py3-pip && yarn global add pnpm

COPY . /app
WORKDIR /app

RUN pnpm install -r --frozen-lockfile
RUN turbo run build

# # Don't run production as root
RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app
USER app

CMD ["node", "apps/backend/dist/main.js"]
