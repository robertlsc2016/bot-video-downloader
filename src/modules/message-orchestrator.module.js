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
  platformsNameURL,
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

      let url = null;

      if (message?.links[0]?.link) {
        url = message.links[0].link;
      }

      const messageBody = message.body;

      if (
        message?._data?.type == "image" &&
        message?._data?.caption?.includes(bot_actions.bot_sticker)
      ) {
        turnInSticker({ message: message });
      }

      if (messageBody?.includes(bot_actions.who_is)) {
        whoIs();
      }

      if (messageBody?.includes(bot_actions.bot_help)) {
        bothelp({ from: from });
      }

      if (messageBody?.includes(bot_actions.coin_flip_string)) {
        headsOrTails({ from: from });
      }

      if (url) {
        if (url.includes(platformsNameURL.tiktok)) {
          await sendMessageAttemptToDownload({ to: from });
          return await downloadVDTiktok({ from: from, url: url });
        }

        if (url.includes(platformsNameURL.instagram)) {
          await sendMessageAttemptToDownload({ to: from });
          return await downloadVDInstagram({
            from: from,
            url: url,
          });
        }

        if (url.includes(platformsNameURL.facebook)) {
          await sendMessageAttemptToDownload({ to: from });
          return await downloadVDFacebook({ from: from, url: url });
        }

        if (url.includes(platformsNameURL.x)) {
          await sendMessageAttemptToDownload({ to: from });
          return await downloadVDTwitter({ from: from, url: url });
        }

        if (platformsNameURL.youtube.filter((yt) => url.includes(yt))) {
          await sendMessageAttemptToDownload({ to: from });
          return await downloadVDYoutube({ url: url });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessageAttemptToDownload = async ({ to: to }) => {
    await genericSendMessageOrchestrator({
      from: to,
      type: "text",
      msg: attemptToDownload,
    });
  };
};
