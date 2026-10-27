# 1. 빌드
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_NAVER_MAP_CLIENT_ID
ARG VITE_GOOGLE_MAPS_API_KEY
RUN npm run build

# 2. 실행
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
