const fs = require("fs");
const os = require("os");
const path = require("path");
const { exec } = require("child_process");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

// const ffmpeg = require("fluent-ffmpeg");

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

const webversion = "2.2412.54v2"
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
    remotePath: `https://raw.githubusercontent.com/guigo613/alternative-wa-version/main/html/${webversion}.html`
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
    console.log("estrou aq");
    const filePath = "facebook-video.mp4";

    await getFbVideoInfo(url).then(async (result) => {
      // const fileStream = fs.createWriteStream(`.\\videos\\${filePath}`);

      await axios({
        method: "get",
        url: result.hd,
        responseType: "stream",
      }).then(async (response) => {
        const writer = fs.createWriteStream(`.\\videos\\${filePath}`);
        await response.data.pipe(writer);

        writer.on("finish", async () => {
          try {
            await cleanVideo(`.\\videos\\${filePath}`, message);
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

  try {
    client.sendMessage(message.from, media, {
      caption: "Ta ai o vídeo do link que tu mandou, corno",
      sendMediaAsDocument: false,
    });
  } catch (err) {
    console.log(err);
  }
};

async function cleanVideo(inputPathRoot, message) {
  ffmpeg(inputPathRoot)
    .outputOptions([
      "-c:v copy", // Copia o vídeo sem reencodar
      "-c:a copy", // Copia o áudio sem reencodar
    ])
    .on("start", function (commandLine) {
      console.log("Iniciado o processamento com comando: " + commandLine);
    })
    .on("progress", function (progress) {
      console.log("Processando: " + progress.percent + "% concluído");
    })
    .on("end", function async() {
      console.log("Processamento finalizado com sucesso!");

      try {
        sendVideo(message, "clear-facebook-video.mp4");
      } catch (err) {
        console.log(err);
      }
    })
    .on("error", function (err, stdout, stderr) {
      console.log("Erro durante o processamento: " + err.message);
    })
    .save(outputPathRoot);
}

client.initialize();
