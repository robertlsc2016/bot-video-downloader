const path = require("path");

const regexURL = /(https?:\/\/[^\s]+)/;
const facebookRegex = /https:\/\/www\.facebook\.com\/[^\s]+/g;
const twitterRegex = /https?:\/\/(?:www\.)?x\.com/;
const instagramRegex = /https:\/\/www\.instagram\.com\/[^\s]+/g;
const tiktokRegex = /tiktok\.com/;

const platformsNameDownload = {
  facebook: "facebook-video.mp4",
  youtube: "youtube-video.mp4",
  instagram: "instagram-video.mp4",
  tiktok: "tiktok-video.mp4",
  x: "x-video.mp4",
};

const videosFolderPath = path.join(__dirname, "..", "..", "videos");
const imagesFolderPath = path.join("..", "..", "images");

const urlsYT = [
  "youtube.com",
  "youtube.com/shorts",
  "youtube.com/watch",
  "youtu.be",
];

const bot_actions = {
  coin_flip_string: "/bot cara ou coroa",
  bot_help: "/bot help",
  bot_sticker: "/bot sticker",
  who_is: "/bot quem é"
};

const failureDownloadMessage =
  "infelizmente, não deu pra baixar seu vídeo, querido. Sinto muito :(";
const technicalLimitationsMessage =
  "cara... seguinte, por limitações tecnicas só da mandar o video assim, contente-se";
const attemptToDownload = "vou tentar baixar esse video ai";
const successDownloadMessage =
  "Segura o video ai!";

module.exports = {
  tiktokRegex,
  platformsNameDownload,
  videosFolderPath,
  technicalLimitationsMessage,
  successDownloadMessage,
  failureDownloadMessage,
  attemptToDownload,
  regexURL,
  facebookRegex,
  twitterRegex,
  instagramRegex,
  urlsYT,
  imagesFolderPath,
  bot_actions,
};
