# Multi-stage Dockerfile for AURA

# Stage 1: Build production assets
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy full application source code
COPY . .

# Compile TypeScript and bundle with Vite
RUN npm run build

# Stage 2: Production Nginx web server
FROM nginx:alpine

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Configure Nginx for Single Page Application (SPA) client routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
