# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Vite application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built assets from the builder stage to nginx's serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Add a basic nginx configuration to handle React Router (client-side routing)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
