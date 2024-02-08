FROM node:18

RUN npm i -g @nestjs/cli

COPY package*.json ./

RUN apt-get update -y && \
    apt-get install -y chromium-browser

RUN npm install

COPY . .

RUN npm run build

EXPOSE 10000

CMD ["npm", "run", "start:prod", "chromium-browser", "--no-sandbox"]