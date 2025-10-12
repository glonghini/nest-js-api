# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Remove devDependencies for smaller image
RUN npm prune --production

# Expose the default NestJS port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
