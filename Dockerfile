FROM node:16.15-alpine3.16

# Set the working directory for the app
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

RUN apk add openssl && \
    apk add openssl-dev && \
    apk add libc6-compat && \
    rm -rf /var/cache/apk/*

RUN npm run prisma:generate
COPY prisma ./prisma/

RUN npm run build

# Expose the app's port
EXPOSE 3001

# Run the app
ENTRYPOINT ["sh", "-c", "sleep 15 && node dist/main.js"]