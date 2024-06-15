const path = require("path");

const regexURL = /(https?:\/\/[^\s]+)/;
const facebookRegex = /https:\/\/www\.facebook\.com\/[^\s]+/g;
const twitterRegex = /https?:\/\/(?:www\.)?x\.com/;

const platformsNameDownload = {
  facebook: "facebook-video.mp4",
  youtube: "youtube-video.mp4",
};

const videosFolderPath = path.join(
  __dirname,
  "..",
  "..",
  "videos",
);

const urlsYT = [
  "youtube.com",
  "youtube.com/shorts",
  "youtube.com/watch",
  "youtu.be",
];

const failureDownloadMessage =
  "infelizmente, não deu pra baixar seu vídeo, querido. Sinto muito :(";
const technicalLimitationsMessage =
  "cara... seguinte, por limitações tecnicas só da mandar o video assim, contente-se";
const attemptToDownload = "vou tentar baixar esse video ai, lgbt";
const successDownloadMessage = "Segura o video ai! (Fala mal do BOT agora comédia)"

module.exports = {
  platformsNameDownload,
  videosFolderPath,
  technicalLimitationsMessage,
  successDownloadMessage,
  failureDownloadMessage,
  attemptToDownload,
  regexURL,
  facebookRegex,
  twitterRegex,
  urlsYT,
};
