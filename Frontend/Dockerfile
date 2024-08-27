# Base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

RUN mkdir -p ./Frontend

# Copy package.json and package-lock.json from the frontend directory
COPY Frontend/package*.json ./Frontend/

# Copy the shared folder from the parent directory
COPY ../shared ./shared
COPY ./Frontend ./Frontend

WORKDIR /app/Frontend

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Expose the port the server will run on
EXPOSE 8000

# Command to run the server
CMD ["node", "server.js"]