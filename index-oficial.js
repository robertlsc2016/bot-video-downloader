
const fs = require("fs");
const os = require("os");

const ytdl = require("ytdl-core");
const getFbVideoInfo = require("fb-downloader-scrapper");

const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

const base64 = require("base64-js");

const axios = require("axios");

const OS =
  os.platform() == "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "/usr/bin/google-chrome-stable";

const client = new Client({
  puppeteer: {
    //args: ["--disable-setuid-sandbox", "--disable-gpu", "--no-sandbox"],
    //executablePath: '/usr/bin/google-chrome-stable',
    headless: true, // Defina como true se desejar executar o Chromium no modo headless
    // executablePath: "C:\\Users\\Robert Luiz\\AppData\\Local\\Programs\\Opera\\opera.exe",
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    //executablePath: 'C:\\Users\\Robert Luiz\\AppData\\Local\\BraveSoftware\\Brave-Browser\\Application\\brave.exe'
    // executablePath: OS,
  },
  authStrategy: new LocalAuth({
    dataPath: "auth",
  }),

  webVersion: "2.2412.54v2",
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/guigo613/alternative-wa-version/main/html/2.2412.54v2.html",
  },
  restartOnAuthFail: true,
});

const regexURL = /(https?:\/\/[^\s]+)/;
const facebookRegex = /https:\/\/www\.facebook\.com\/[^\s]+/g;

const urlsYT = [
  "youtube.com",
  "youtube.com/shorts",
  "youtube.com/watch",
  "youtu.be",
];

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });

  console.log(qr);
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  const bruteMessageWithLink = message.body;
  console.log(bruteMessageWithLink);
  //console.log("1", bruteMessageWithLink.match(regexURL))
  //if (urlsYT.filter(yt => bruteMessageWithLink.includes(yt))[0]) { console.log("verdade porra") }

  if (bruteMessageWithLink.match(facebookRegex)) {
    const url = bruteMessageWithLink.match(facebookRegex);
    console.log(url[0]);
    downloadVDFacebook(url[0], message);
  }

  if (
    bruteMessageWithLink.match(regexURL) &&
    urlsYT.filter((yt) => bruteMessageWithLink.includes(yt))[0]
  ) {
    const cleanLink = bruteMessageWithLink.match(regexURL)[0];
    console.log(cleanLink);
    downloadVDYoutube(message, cleanLink);
  }
});

const downloadVDFacebook = async (url, message) => {
  client.sendMessage(message.from, "vou tentar baixar esse video ai");
  const filePath = "facebook-video.mp4";

  getFbVideoInfo(url)
    .then((result) => {
      axios({
        method: "get",
        url: result.sd,
        responseType: "stream",
      })
        .then((response) => {
          const writer = fs.createWriteStream(filePath);

          response.data.pipe(filePath);

          writer.on("finish", () => {
            try {
              const media = MessageMedia.fromFilePath(filePath);
              client.sendMessage(message.from, media, {
                caption: "Ta ai o vídeo do link que tu mandou, corno",
              });
            } catch (err) {
              console.error("Ocorreu um erro:", err);
            }
          });

          writer.on("error", (err) => {
            console.error("Erro ao salvar o vídeo:", err);
          });
        })
        .catch((error) => {
          console.error("Erro ao baixar o vídeo:", error);
        });
    })
    .catch((err) => {
      console.log(error);
    });
};

const downloadVDYoutube = async (message, cleanLink) => {
  client.sendMessage(message.from, "vou tentar baixar esse video ai, lgbt");

  console.log("entroiu no downloadVDYoutube");
  let writableStream;
  const filePath = "youtube-video.mp4";

  if (ytdl.validateURL(cleanLink)) {
    ytdl(cleanLink, { dlChunkSize: 0, quality: "lowest" }).pipe(
      (writableStream = fs.createWriteStream(filePath))
    );
  }

  writableStream.on("finish", async () => {
    try {
      const media = MessageMedia.fromFilePath(filePath);
      client.sendMessage(message.from, media, {
        caption: "Ta ai o vídeo do link que tu mandou, corno",
      });
    } catch (err) {
      console.error("Ocorreu um erro:", err);
    }
  });
};

client.initialize();
