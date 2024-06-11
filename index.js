const fs = require("fs");
const os = require("os");
const path = require("path");
const { exec } = require("child_process");
const { TwitterDL } = require("twitter-downloader");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

// const ffmpeg = require("fluent-ffmpeg");


const localVariable = undefined

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

// const inputPathRoot = path.join(__dirname, "\\videos\\facebook-video.mp4"); // Caminho do vídeo de entrada
// const outputPathRoot = path.join(__dirname, "\\videos\\clear-facebook-video.mp4"); // Caminho do vídeo de saída

const inputPathRoot = path.join(".\\", "videos\\facebook-video.mp4"); // Caminho do vídeo de entrada
const outputPathRoot = path.join(".\\", "videos\\clear-facebook-video.mp4"); // Caminho do vídeo de saída

const webversion = "2.2412.54v2";
// const webversion = "2.2413.51-beta-alt";

const client = new Client({
  puppeteer: {
    // args: ["--disable-setuid-sandbox", "--disable-gpu", "--no-sandbox"],
    args: ["--no-sandbox", "--disable-gpu"],

    headless: true,
    // executablePath: '.\\chrome\\win64-125.0.6422.141\\chrome-win64\\chrome.exe'
    executablePath:
      "C:\\Users\\Robert Luiz\\AppData\\Local\\Programs\\Opera\\opera.exe",
    // executablePath:
    //   "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  },
  authStrategy: new LocalAuth({
    dataPath: "auth",
  }),

  webVersion: webversion,
  webVersionCache: {
    type: "remote",
    // path: `./html/${webversion}.html`,
    remotePath: `https://raw.githubusercontent.com/guigo613/alternative-wa-version/main/html/${webversion}.html`,
  },
  restartOnAuthFail: true,
});

const regexURL = /(https?:\/\/[^\s]+)/;
const facebookRegex = /https:\/\/www\.facebook\.com\/[^\s]+/g;
const twitterRegex = /https?:\/\/(?:www\.)?x\.com/;

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

// client.on("message_create", async (message) => {
//   console.log('mensagem propria')
//   const bruteMessageWithLink = message.body;
//   console.log(bruteMessageWithLink);

//   if (bruteMessageWithLink.match(twitterRegex)) {
//     const url = bruteMessageWithLink.match(twitterRegex);
//     client.sendMessage(localVariable || message.from, "vou tentar baixar esse video ai, lgbt");

//     console.log(url[0]);
//     downloadTwitter(bruteMessageWithLink, message);
//   }
// });

client.on("message", async (message) => {
  const bruteMessageWithLink = message.body;
  console.log(bruteMessageWithLink);

  if (bruteMessageWithLink.match(facebookRegex)) {
    const url = bruteMessageWithLink.match(facebookRegex);
    client.sendMessage(localVariable || message.from, "vou tentar baixar esse video ai, lgbt");

    console.log(url[0]);
    downloadVDFacebook(url[0], message);
  }

  if (bruteMessageWithLink.match(twitterRegex)) {
    const url = bruteMessageWithLink.match(twitterRegex);
    client.sendMessage(localVariable || message.from, "vou tentar baixar esse video ai, lgbt");

    console.log(url[0]);
    downloadTwitter(url[0], message);
  }

  if (
    bruteMessageWithLink.match(regexURL) &&
    urlsYT.filter((yt) => bruteMessageWithLink.includes(yt))[0]
  ) {
    client.sendMessage(localVariable || message.from, "vou tentar baixar esse video ai, lgbt");
    const cleanLink = bruteMessageWithLink.match(regexURL)[0];
    downloadVDYoutube(message, cleanLink);
  }
});

const downloadVDFacebook = async (url, message) => {
  try {
    console.log("entrou no facebook");
    const filePath = "facebook-video.mp4";

    await getFbVideoInfo(url).then(async (result) => {
      // const fileStream = fs.createWriteStream(`.\\videos\\${filePath}`);

      await axios({
        method: "get",
        url: result.sd,
        responseType: "stream",
      }).then(async (response) => {
        const writer = fs.createWriteStream(`.\\videos\\${filePath}`);
        await response.data.pipe(writer);

        writer.on("finish", async () => {
          try {
            sendVideo(message, filePath, true);
            // await cleanVideo(`.\\videos\\${filePath}`, message);
          } catch (error) {
            console.error("Erro ao limpar o vídeo ou enviar o vídeo:", error);
          }
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

    videoReadable.pipe(writableStream);

    writableStream.on("finish", async () => {
      try {
        sendVideo(message, filePath, false);
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

const downloadTwitter = async (url, message) => {
  console.log("entrou no baixador do twitter");
  console.log(url)
  TwitterDL(url, {
    //   authorization?: ", // undefined == use default authorization
    //   cookie?: "YOUR_COOKIE" // to display sensitive / nsfw content (no default cookies)
  })
    .then(async (result) => {
      await axios({
        method: "get",
        url: result.result.media[0].videos[1].url,
        responseType: "stream",
      }).then(async (response) => {
        console.log(result)
        const filePath = "x-video.mp4";

        const writer = fs.createWriteStream(`.\\videos\\${filePath}`);
        await response.data.pipe(writer);

        writer.on("finish", async () => {
          sendVideo(message, filePath, false);

          console.log("videos baixado");
        });

        console.log(response);
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

const sendVideo = async (message, filePath, isDocument) => {
  const media = MessageMedia.fromFilePath(`.\\videos\\${filePath}`);

  try {
    client.sendMessage(localVariable || message.from, media, {
      caption: isDocument
        ? "cara... seguinte, por limitações tecnicas só da mandar o video assim, contente-se"
        : "vou tentar baixar esse video ai, lgbt",
      sendMediaAsDocument: isDocument,
    });
  } catch (err) {
    console.log(err);
  }
};

client.initialize();
