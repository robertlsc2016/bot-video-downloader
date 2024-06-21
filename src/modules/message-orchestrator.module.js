const { downloadVDFacebook } = require("./platforms/facebook-download.module");
const { downloadVDTwitter } = require("./platforms/twitter-download.module");
const { downloadVDYoutube } = require("./platforms/youtube-download.module");

const qrcode = require("qrcode-terminal");

const { client } = require("../settings/settings");

const {
  urlsYT,
  regexURL,
  facebookRegex,
  twitterRegex,
  attemptToDownload,
  instagramRegex,
  tiktokRegex,
  bot_actions,
  readyMessage,
} = require("../utils/constants");

const { stringToGroup } = require("../settings/necessary-settings");
const {
  genericSendMessageOrchestrator,
} = require("./generic-sendMessage-orchestrator.module");
const {
  downloadVDInstagram,
} = require("./platforms/instagram-download.module");
const { downloadVDTiktok } = require("./platforms/tiktok-download.module");
const { headsOrTails } = require("./bots-actions/coin_flip");
const { bothelp } = require("./bots-actions/bot-help");
const { turnInSticker } = require("./bots-actions/turn-in-sticker");
const { whoIs } = require("./bots-actions/whois-is");

module.exports.runMessageOrchestrator = function () {
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log(qr);
  });

  client.on("ready", async () => {
    console.log("Client is ready!");
    await genericSendMessageOrchestrator({
      from: stringToGroup,
      type: "text",
      msg: readyMessage,
    });
  });

  client.on("message_create", async (message) => {
    if (message._data.id.fromMe && message.to == stringToGroup) {
      await messageSteps({ from: stringToGroup, message: message });
    }
  });

  client.on("message", async (message) => {
    await messageSteps({ from: message.from, message: message });
  });

  const messageSteps = async ({ from: from, message: message }) => {
    try {
      if (from !== stringToGroup)
        throw new Error("o envio não foi configurado para esse destinatário");

      const bruteMessageWithLink = message.body;

      if (
        message?._data?.type == "image" &&
        message?._data?.caption.includes(bot_actions.bot_sticker)
      ) {
        turnInSticker({ message: message });
      }

      if (bruteMessageWithLink.includes(bot_actions.who_is)) {
        whoIs();
      }

      if (bruteMessageWithLink.includes(bot_actions.bot_help)) {
        bothelp({ from: from });
      }

      if (bruteMessageWithLink.includes(bot_actions.coin_flip_string)) {
        headsOrTails({ from: from });
      }

      if (bruteMessageWithLink.match(tiktokRegex)) {
        const url = bruteMessageWithLink.match(tiktokRegex);
        await genericSendMessageOrchestrator({
          from: from,
          type: "text",
          msg: attemptToDownload,
        });

        downloadVDTiktok({ from: from, url: bruteMessageWithLink });
      }

      if (bruteMessageWithLink.match(instagramRegex)) {
        const url = bruteMessageWithLink.match(instagramRegex);
        await genericSendMessageOrchestrator({
          from: from,
          type: "text",
          msg: attemptToDownload,
        });
        downloadVDInstagram({
          from: from,
          url: url[0],
        });
      }

      if (bruteMessageWithLink.match(facebookRegex)) {
        const url = bruteMessageWithLink.match(facebookRegex);
        await genericSendMessageOrchestrator({
          from: from,
          type: "text",
          msg: attemptToDownload,
        });

        downloadVDFacebook({ from: from, url: url[0] });
      }

      if (bruteMessageWithLink.match(twitterRegex)) {
        const url = bruteMessageWithLink.match(twitterRegex);

        await genericSendMessageOrchestrator({
          from: from,
          type: "text",
          msg: attemptToDownload,
        });

        downloadVDTwitter({ from: from, url: bruteMessageWithLink });
      }

      if (
        bruteMessageWithLink.match(regexURL) &&
        urlsYT.filter((yt) => bruteMessageWithLink.includes(yt))[0]
      ) {
        await genericSendMessageOrchestrator({
          from: from,
          type: "text",
          msg: attemptToDownload,
        });
        const cleanLink = bruteMessageWithLink.match(regexURL)[0];
        downloadVDYoutube(from, cleanLink);
      }
    } catch (error) {
      console.error(error);
    }
  };
};
