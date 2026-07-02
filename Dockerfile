# Build stage
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install packages
RUN npm ci --only=production --omit=dev

# Copy application source code
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
