# Stage 1: Build stage (Dependencies and caching)
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable

# Layer caching: Copy only package files first
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Stage 2: Production stage (Principle of least privilege)
FROM node:20-alpine

# Set Node environment to production
ENV NODE_ENV=production

# Switch to the built-in non-root "node" user
USER node

WORKDIR /app

# Copy ONLY necessary files from the builder stage, maintaining proper ownership
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/package.json ./
COPY --chown=node:node --from=builder /app/src ./src
COPY --chown=node:node --from=builder /app/.env ./

# Expose the API port
EXPOSE 8000

# Start the application directly with Node (no pnpm overhead)
CMD ["node", "src/index.js"]
