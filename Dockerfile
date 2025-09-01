# Multi-stage build for Prima+ E2E Tests
FROM cypress/browsers:latest as base

# Set working directory
WORKDIR /e2e

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Set proper permissions
RUN chmod +x /e2e

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f https://www.iprima.cz/ || exit 1

# Default command
CMD ["npx", "cypress", "run", "--reporter", "mochawesome", "--reporter-options", "reportDir=cypress/reports,overwrite=false,html=true,json=true"]

# Production stage
FROM base as production
ENV NODE_ENV=production
EXPOSE 8080

# Development stage  
FROM base as development
ENV NODE_ENV=development
RUN npm install
CMD ["npx", "cypress", "open"]