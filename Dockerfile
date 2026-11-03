FROM node:22-bookworm-slim

WORKDIR /app

COPY . /tmp/src

RUN set -eux; \
  if [ -d /tmp/src/src/app ]; then \
    cp -a /tmp/src/. /app/; \
  elif [ -d /tmp/src/app ]; then \
    cp -a /tmp/src/. /app/; \
  elif [ -d /tmp/src/WebStudio/src/app ]; then \
    cp -a /tmp/src/WebStudio/. /app/; \
  else \
    found="$(find /tmp/src -type d -path '*/src/app' -print -quit)"; \
    if [ -n "$found" ]; then \
      cp -a "$(dirname "$(dirname "$found")")/." /app/; \
    else \
      echo "Khong tim thay src/app trong repo."; \
      find /tmp/src -maxdepth 3 -type d; \
      exit 1; \
    fi; \
  fi; \
  test -f /app/package.json; \
  test -d /app/src/app -o -d /app/app

RUN npm ci

ENV APP_KHACH_SERVER=1
ENV NEXT_PUBLIC_APP_KHACH_SERVER=1
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

RUN mkdir -p /app/data && npm run build

ENV DATABASE_PATH=/app/data/webstudio.db

EXPOSE 3000

CMD ["npm", "start"]
