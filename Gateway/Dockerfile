# Base image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

RUN mkdir -p ./Gateway

# Install app dependencies by copying
# package.json and package-lock.json
COPY Gateway/package*.json ./Gateway/


# Copy the rest of the application code
COPY ./shared ./shared
COPY ./Gateway ./Gateway

WORKDIR /usr/src/app/Gateway

RUN npm install

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
