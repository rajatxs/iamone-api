
# https://hub.docker.com/_/node
FROM node:14-slim

WORKDIR /usr/src/app

# Copy project metadata
COPY package.json ./
COPY yarn.lock ./
COPY app.json ./

RUN npm install --only=production

# Copy local code to the container image.
COPY . ./

# Run the web service on container startup.
CMD [ "node", "dist/main.js" ]
