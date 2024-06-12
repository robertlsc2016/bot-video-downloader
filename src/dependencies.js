const fs = require("fs");
const os = require("os");
const path = require("path");
const { TwitterDL } = require("twitter-downloader");
const base64 = require("base64-js");
const axios = require("axios");
const ytdl = require("ytdl-core");
const getFbVideoInfo = require("fb-downloader-scrapper");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

module.exports = {
  fs,
  os,
  path,
  TwitterDL,
  base64,
  axios,
  ytdl,
  getFbVideoInfo,
  qrcode,
  Client,
  LocalAuth,
  MessageMedia,
};
