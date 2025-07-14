# Use Node.js LTS Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Create data directory for persistence
RUN mkdir -p /app/data

# Expose port
EXPOSE 8080

# Start both frontend and backend
CMD ["npm", "run", "start:prod"]