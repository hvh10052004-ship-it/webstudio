FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV APP_KHACH_SERVER=1
ENV NEXT_PUBLIC_APP_KHACH_SERVER=1
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/webstudio.db

RUN mkdir -p data && npm run build

EXPOSE 3000

CMD ["npm", "start"]
