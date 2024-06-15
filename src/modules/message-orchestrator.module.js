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
} = require("../utils/constants");

const { ShippingAllowed } = require("../settings/necessary-settings");
const {
  genericSendMessageOrchestrator,
} = require("./generic-sendMessage-orchestrator.module");

module.exports.runMessageOrchestrator = function () {
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log(qr);
  });

  client.on("ready", () => {
    client.sendMessage("5596060121@c.us", "o pai ta online!");
    console.log("Client is ready!");
  });

  client.on("message", async (message) => {
    console.log(message.body);
    const bruteMessageWithLink = message.body;

    if (bruteMessageWithLink.match(facebookRegex)) {
      const url = bruteMessageWithLink.match(facebookRegex);
      await genericSendMessageOrchestrator({
        from: message.from,
        type: "text",
        msg: attemptToDownload,
      });

      console.log(url[0]);
      downloadVDFacebook(message.from, url[0]);
    }

    if (bruteMessageWithLink.match(twitterRegex)) {
      const url = bruteMessageWithLink.match(twitterRegex);

      await genericSendMessageOrchestrator({
        from: message.from,
        type: "text",
        msg: attemptToDownload,
      });

      downloadVDTwitter(bruteMessageWithLink, message.from);
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
  });
};
