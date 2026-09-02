FROM node:22-slim AS build

# Chromium из apt — puppeteer использует его вместо скачивания своего
RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium fonts-liberation fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_DOWNLOAD=1 \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PPTR_NO_SANDBOX=1

WORKDIR /src
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime-production
COPY --from=build /src/build /usr/share/nginx/html
