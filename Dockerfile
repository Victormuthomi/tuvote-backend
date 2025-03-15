# Build Stage
FROM node:16-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy the application code
COPY . .

# Run the app build (ensure this command is valid in your package.json)
RUN npm run build

# Production Stage
FROM node:16-alpine

WORKDIR /app

# Copy only production node_modules from the build stage
COPY --from=build /app/node_modules /app/node_modules

# Copy only essential files to the production image
COPY . .

# Expose the port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]

