# Dockerfile

FROM node:20-slim AS builder
WORKDIR /app

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY package*.json ./  
RUN npm install --ignore-scripts

COPY src/ ./src/
COPY public/ ./public/
COPY *.html *.ts *.js *.json ./

RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

RUN adduser -D -u 1000 nginxuser && \
    chown -R nginxuser:nginxuser /usr/share/nginx/html && \
    chown -R nginxuser:nginxuser /var/cache/nginx && \
    chown -R nginxuser:nginxuser /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginxuser:nginxuser /var/run/nginx.pid

USER nginxuser

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]