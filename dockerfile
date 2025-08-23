# Use the official Node.js image as the base
FROM node:lts

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
# We copy these first to leverage Docker's layer caching
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port your NestJS application listens on
EXPOSE 3000

# Define the command to run your application
CMD [ "npm", "run", "start:prod" ]