const { path } = require("../dependencies");

const regexURL = /(https?:\/\/[^\s]+)/;
const facebookRegex = /https:\/\/www\.facebook\.com\/[^\s]+/g;
const twitterRegex = /https?:\/\/(?:www\.)?x\.com/;

const urlsYT = [
  "youtube.com",
  "youtube.com/shorts",
  "youtube.com/watch",
  "youtu.be",
];

const inputPathRoot = path.join("..\\", "videos\\facebook-video.mp4"); // Caminho do vídeo de entrada
const outputPathRoot = path.join("..\\", "videos\\clear-facebook-video.mp4"); // Caminho do vídeo de saída

const localVariable = undefined;

module.exports = {
  inputPathRoot,
  outputPathRoot,
  regexURL,
  facebookRegex,
  twitterRegex,
  urlsYT,
  localVariable,
};
