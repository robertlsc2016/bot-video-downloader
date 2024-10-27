FROM node:latest

WORKDIR /app

RUN apt update \
    && apt install -y wget gnupg ffmpeg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt update \
    && apt install -y google-chrome-stable \ 
    install \libxss1 \libappindicator1 \libindicator7\
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-khmeros \
    fonts-kacst \
    libcairo2-dev \libpango1.0-dev \libjpeg-dev \libgif-dev \librsvg2-dev\
    fonts-freefont-ttf \ 
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*


RUN npm cache clean --force

RUN rm -rf node_modules package-lock.json

COPY package.json .
COPY package-lock.json .

RUN npm install

EXPOSE 80

COPY . .

CMD ["npm", "start"]