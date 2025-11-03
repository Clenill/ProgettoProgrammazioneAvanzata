FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3000

# Start app
CMD ["node", "dist/server.js"]
