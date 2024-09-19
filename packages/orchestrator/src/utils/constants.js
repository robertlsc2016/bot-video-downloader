const path = require("path");
const { prefixBot } = require("../settings/necessary-settings");

const regexURL = /(https?:\/\/[^\s]+)/;
const facebookRegex = /https:\/\/www\.facebook\.com\/[^\s]+/g;
const twitterRegex = /https?:\/\/(?:www\.)?x\.com/;
const instagramRegex = /https:\/\/www\.instagram\.com\/[^\s]+/g;
const tiktokRegex = /tiktok\.com/;

const platformsNameDownload = {
  facebook: "facebook-video.mp4",
  facebookPhoto: "facebook-photo.jpg",
  youtube: "youtube-video.mp4",
  youtubeAudio: "youtube-audio.mp3",
  instagram: "instagram-video.mp4",
  instagramPhoto: "instagram-photo.jpg",
  pinterestPhoto: "pintrest-photo.jpg",
  pinterestVideo: "pintrest-video.mp4",
  tiktok: "tiktok-video.mp4",
  x: "x-video.mp4",
};

const platformsNameURL = {
  facebook: "facebook.com",
  instagram: "instagram.com",
  pinterest: ["pinterest.com", "pin.it"],
  x: "x.com",
  tiktok: "tiktok.com",
  youtube: [
    "youtube.com",
    "youtube.com/shorts",
    "youtube.com/watch",
    "youtu.be",
  ],
};

const urlsYT = [
  "youtube.com",
  "youtube.com/shorts",
  "youtube.com/watch",
  "youtu.be",
];

const bot_actions = {
  coin_flip_string: `${prefixBot} cara ou coroa`,
  bot_help: `${prefixBot} help`,
  bot_sticker: `${prefixBot} sticker`,
  who_is: `${prefixBot} quem é`,
  is_true: `${prefixBot} é verdade`,
  statistics: `${prefixBot} estatisticas`,
  pre_questions_chatgpt_bot_really: `${prefixBot} ??`,
  pre_questions_chatgpt_bot: `${prefixBot} ?`,
};

module.exports = {
  tiktokRegex,
  platformsNameDownload,
  regexURL,
  facebookRegex,
  twitterRegex,
  instagramRegex,
  urlsYT,
  bot_actions,
  platformsNameURL,
};
