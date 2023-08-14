FROM node:16.15-alpine3.16

# Set the working directory for the app
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./
COPY wait-for-it.sh ./
RUN chmod +x ./wait-for-it.sh

# Install the dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

RUN apk add openssl && \
    apk add openssl-dev && \
    apk add libc6-compat && \
    rm -rf /var/cache/apk/* && \
    apk add --no-cache bash

RUN npm run prisma:generate
COPY prisma ./prisma/

RUN npm run build

# Expose the app's port
EXPOSE 3001

# Run the app
ENTRYPOINT ["sh", "-c", "\
    ./wait-for-it.sh postgresdb:5432 -t 0 -- npm run prisma:migrate && \
    npm run prisma:push && \
    node dist/main.js & \
    wait $!"]