const { downloadVDFacebook } = require("./platforms/facebook-download.module");
const { downloadVDTwitter } = require("./platforms/twitter-download.module");
const { downloadVDYoutube } = require("./platforms/youtube-download.module");

const qrcode = require("qrcode-terminal");
const { MessageMedia } = require("whatsapp-web.js");

const { client } = require("../settings/settings");

const {
  urlsYT,
  regexURL,
  facebookRegex,
  twitterRegex,
  technicalLimitationsMessage,
  attemptToDownload,
  failureDownloadMessage,
  instagramRegex,
  tiktokRegex,
} = require("../utils/constants");

const {
  ShippingAllowed,
  stringToGroup,
} = require("../settings/necessary-settings");
const {
  genericSendMessageOrchestrator,
} = require("./generic-sendMessage-orchestrator.module");
const {
  downloadVDInstagram,
} = require("./platforms/instagram-download.module");
const { downloadVDTiktok } = require("./platforms/tiktok-download.module");

module.exports.runMessageOrchestrator = function () {
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log(qr);
  });

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("message", async (message) => {
    try {
      if (message.from !== stringToGroup)
        throw new Error("o envio não foi configurado para esse destinatário");

      const bruteMessageWithLink = message.body;

      if (bruteMessageWithLink.match(tiktokRegex)) {
        const url = bruteMessageWithLink.match(tiktokRegex);
        await genericSendMessageOrchestrator({
          from: message.from,
          type: "text",
          msg: attemptToDownload,
        });

        console.log(url[0]);
        downloadVDTiktok({ from: message.from, url: bruteMessageWithLink });
      }

      if (bruteMessageWithLink.match(instagramRegex)) {
        const url = bruteMessageWithLink.match(instagramRegex);
        await genericSendMessageOrchestrator({
          from: message.from,
          type: "text",
          msg: attemptToDownload,
        });
        downloadVDInstagram({
          from: message.from,
          url: url[0],
        });
      }

      if (bruteMessageWithLink.match(facebookRegex)) {
        const url = bruteMessageWithLink.match(facebookRegex);
        await genericSendMessageOrchestrator({
          from: message.from,
          type: "text",
          msg: attemptToDownload,
        });

        downloadVDFacebook({ from: message.from, url: url[0] });
      }

      if (bruteMessageWithLink.match(twitterRegex)) {
        const url = bruteMessageWithLink.match(twitterRegex);

        await genericSendMessageOrchestrator({
          from: message.from,
          type: "text",
          msg: attemptToDownload,
        });

        downloadVDTwitter({ from: message.from, url: bruteMessageWithLink });
      }

      if (
        bruteMessageWithLink.match(regexURL) &&
        urlsYT.filter((yt) => bruteMessageWithLink.includes(yt))[0]
      ) {
        await genericSendMessageOrchestrator({
          from: message.from,
          type: "text",
          msg: attemptToDownload,
        });
        const cleanLink = bruteMessageWithLink.match(regexURL)[0];
        downloadVDYoutube(message.from, cleanLink);
      }
    } catch(error) {
      console.error(error)
    }
  });
};
