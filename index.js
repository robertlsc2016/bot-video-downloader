const qrcode = require('qrcode-terminal');
const fs = require('fs');
const ytdl = require('ytdl-core');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const client = new Client({
    puppeteer: {
        args: ['--disable-setuid-sandbox', '--disable-gpu', '--no-sandbox'],
        //executablePath: '/usr/bin/chromium-browser',
        executablePath: '/usr/bin/google-chrome',
        headless: true, // Defina como true se desejar executar o Chromium no modo headless
        //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    },
    authStrategy: new LocalAuth({
        dataPath: 'auth'
    })
});

const regexURLYoutube = /(https?:\/\/(www\.)?youtu(be\.com\/watch\?v=|be\/|com\/shorts\/)|[^\s]+)/i;

client.on('qr', (qr) => {
    console.log(qr)
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message) => {
    const bruteMessageWithLink = message.body

    if (bruteMessageWithLink.match(regexURL) && (bruteMessageWithLink.match(regexURLYoutube))) {
        const cleanLink = bruteMessageWithLink.match(regexURL)[0]
        console.log(cleanLink)
        downloadVDYoutube(message, cleanLink)
    }

});

const downloadVDYoutube = async (message, cleanLink) => {
    let writableStream

    if (ytdl.validateURL(cleanLink)) {
        ytdl(cleanLink, { dlChunkSize: 0, quality: 'lowest' })
            .pipe(writableStream = fs.createWriteStream('video.mp4'));
    }

    writableStream.on('finish', () => {
        try {
            const media = MessageMedia.fromFilePath('./video.mp4');
            client.sendMessage(message.from, media, { caption: "Ta ai o vídeo do link que tu mandou, corno" })
        } catch (err) {
            console.error('Ocorreu um erro:', err);
        }
    });
}


client.initialize();
