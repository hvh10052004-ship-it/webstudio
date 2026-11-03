FROM node:22-bookworm-slim

WORKDIR /app

COPY . .

# Repo GitHub để mã trong thư mục webstudio hoặc WebStudio
RUN if [ ! -d src/app ] && [ ! -d app ]; then \
      if [ -d webstudio/src/app ]; then cp -a webstudio/. /app/; \
      elif [ -d WebStudio/src/app ]; then cp -a WebStudio/. /app/; \
      fi; \
    fi \
    && if [ ! -d src/app ] && [ ! -d app ]; then \
      echo "Khong thay thu muc src/app. Hay dat Root Directory = webstudio tren Render." \
      && ls -la && exit 1; \
    fi \
    && npm ci

ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

RUN mkdir -p /app/data && npm run build

ENV DATABASE_PATH=/app/data/webstudio.db

EXPOSE 3000

CMD ["npm", "start"]
