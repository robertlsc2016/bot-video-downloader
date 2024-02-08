FROM node:18

COPY package*.json ./

RUN apt-get update && apt-get install -y chromium-browser

RUN npm install

COPY . .

RUN npm run build

EXPOSE 10000

CMD ["npm", "run", "start:prod", "chromium-browser", "--no-sandbox"]