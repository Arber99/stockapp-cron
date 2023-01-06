FROM node:16.13.2-alpine

# Set the working directory for the app
WORKDIR /src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Expose the app's port
EXPOSE 3001

# Run the app
CMD [ "npm", "start" ]