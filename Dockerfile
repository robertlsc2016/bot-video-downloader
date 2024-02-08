#FROM debian:latest
FROM node:latest
# RUN rm /bin/sh && ln -s /bin/bash /bin/sh
WORKDIR /app


COPY . .

COPY package*.json ./

RUN  apt-get install chromium-browser

# RUN apt-get update -y
# RUN apt update && apt install -y chromium-browser 

# RUN apk add chromium-browser

RUN npm install

RUN npm run start

EXPOSE 3000

CMD [ "node", "index.js", "npm", "chromium-browser", "--no-sandbox", "dist/server/server.js" ]
