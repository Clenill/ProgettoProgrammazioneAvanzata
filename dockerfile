FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# Expose API port
EXPOSE 3000

# Start app
CMD ["node", "dist/server.js"]
