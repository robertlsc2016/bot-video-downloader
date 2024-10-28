FROM node:latest

WORKDIR /app

# Atualizar e instalar as dependências necessárias
RUN apt update \
    && apt install -y wget gnupg ffmpeg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt update \
    && apt install -y google-chrome-stable \
       libxss1 \
       libappindicator1 \
       libindicator7 \
       fonts-ipafont-gothic \
       fonts-wqy-zenhei \
       fonts-thai-tlwg \
       fonts-khmeros \
       fonts-kacst \
       libcairo2-dev \
       libpango1.0-dev \
       libjpeg-dev \
       libgif-dev \
       librsvg2-dev \
       fonts-freefont-ttf \
       --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Limpeza do cache do npm
RUN npm cache clean --force

# Remover node_modules e package-lock.json para uma instalação limpa
RUN rm -rf node_modules package-lock.json

# Copiar arquivos de configuração e instalar pacotes
COPY package.json . 
COPY package-lock.json . 
RUN npm install

# Expor a porta da aplicação
EXPOSE 80

# Copiar o código da aplicação
COPY . .

# Comando para iniciar a aplicação
CMD ["npm", "start"]
