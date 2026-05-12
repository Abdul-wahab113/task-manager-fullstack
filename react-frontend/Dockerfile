# Stage 1: Build the React Application
FROM node:20-alpine AS builder

WORKDIR /app

# Layer caching: Copy package files first
COPY package.json package-lock.json* ./

# Install dependencies (npm ci is faster and stricter for CI/CD)
RUN npm install

# Copy application code and build
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx (Principle of Least Privilege)
FROM nginx:1.25-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Principle of Least Privilege: Configure Nginx to run as a non-root user
# Grant the 'nginx' user ownership over required directories and create the PID file
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port 8080 (non-root users cannot bind to ports below 1024)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
