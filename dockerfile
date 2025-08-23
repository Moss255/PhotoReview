# --- Stage 1: Build stage ---
FROM node:lts AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the TypeScript application
RUN npm run build

# --- Stage 2: Production stage ---
FROM node:lts

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json to the production image
COPY --from=build /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the compiled application from the build stage
COPY --from=build /usr/src/app/dist ./dist

# Copy the Handlebars template files
COPY --from=build /usr/src/app/views ./views

RUN mkdir -p data/uploads

# Expose the application port
EXPOSE 3000

# Start the application
CMD [ "node", "dist/main.js" ]