FROM node:18

COPY package*.json ./

RUN sudo apt-get install chromium-browser

RUN npm install

COPY . .

RUN npm run build

EXPOSE 10000

CMD ["npm", "run", "start:prod", "chromium-browser", "--no-sandbox"]