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
    // args: ["--disable-setuid-sandbox", "--disable-gpu", "--no-sandbox"],
    args: ["--no-sandbox", "--disable-gpu"],

    headless: true,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  },
  authStrategy: new LocalAuth({
    dataPath: "auth",
  }),
  // webVersionCache: {
  //   type: "remote",
  //   remotePath:
  //     "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  // },

  // webVersion: "2.2412.54v2",
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/guigo613/alternative-wa-version/main/html/2.2412.54v2.html",
  },

  // webVersionCache: {
  //   type: "remote",
  //   remotePath:
  //     "https://raw.githubusercontent.com/guigo613/alternative-wa-version/main/html/2.2412.54v2.html",
  // },
  // restartOnAuthFail: true,
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

  if (bruteMessageWithLink.match(facebookRegex)) {
    const url = bruteMessageWithLink.match(facebookRegex);
    client.sendMessage(message.from, "vou tentar baixar esse video ai, lgbt");

    console.log(url[0]);
    downloadVDFacebook(url[0], message);
  }

  if (
    bruteMessageWithLink.match(regexURL) &&
    urlsYT.filter((yt) => bruteMessageWithLink.includes(yt))[0]
  ) {
    client.sendMessage(message.from, "vou tentar baixar esse video ai, lgbt");
    const cleanLink = bruteMessageWithLink.match(regexURL)[0];
    downloadVDYoutube(message, cleanLink);
  }
});

const downloadVDFacebook = async (url, message) => {
  try {
    const filePath = "facebook-video.mp4";

    await getFbVideoInfo(url).then(async (result) => {
      const fileStream = fs.createWriteStream(`.\\videos\\${filePath}`);

      await axios({
        method: "get",
        url: result.sd,
        responseType: "stream",
      }).then(async (response) => {
        const writer = fs.createWriteStream(`.\\videos\\${filePath}`);

        await response.data.pipe(writer);

        writer.on("finish", () => {
          sendVideo(message, filePath);
        });
      });
    });
  } catch (error) {
    console.error("Erro ao baixar o vídeo:", error);
  }
};

const downloadVDYoutube = async (message, cleanLink) => {
  const filePath = "youtube-video.mp4";

  try {
    const writableStream = fs.createWriteStream(`.\\videos\\${filePath}`);
    const videoInfo = await ytdl.getBasicInfo(cleanLink);
    const videoReadable = ytdl(cleanLink, { quality: "lowest" });
    console.log(videoReadable);
    videoReadable.pipe(writableStream);

    writableStream.on("finish", async () => {
      try {
        sendVideo(message, filePath);
      } catch (err) {
        console.error("Ocorreu um erro:", err);
      }
    });

    writableStream.on("error", (err) => {
      console.error("Erro ao salvar o vídeo:", err);
    });
  } catch (error) {
    console.error("Erro ao baixar o vídeo:", error);
  }
};

const sendVideo = async (message, filePath) => {
  const media = MessageMedia.fromFilePath(`.\\videos\\${filePath}`);

  client.sendMessage(message.from, media, {
    caption: "Ta ai o vídeo do link que tu mandou, corno",
  });
};

client.initialize();
