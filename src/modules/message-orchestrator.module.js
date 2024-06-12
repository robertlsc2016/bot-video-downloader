const { runClient } = require("../config/config");
const {
  urlsYT,
  regexURL,
  localVariable,
  facebookRegex,
  twitterRegex,
} = require("../utils/constants");
const { downloadVDFacebook } = require("./platforms/facebook-download.module");
const { downloadTwitter } = require("./platforms/twitter-download.module");
const { downloadVDYoutube } = require("./platforms/youtube-download.module");

const { qrcode } = require("../dependencies");

const client = runClient();

const runMessageOrchestrator = () => {
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log(qr);
  });

  client.on("ready", () => {
    client.sendMessage(localVariable, "o pai ta online!");
    console.log("Client is ready!");
  });

  client.on("message", async (message) => {
    const bruteMessageWithLink = message.body;

    if (bruteMessageWithLink.match(facebookRegex)) {
      const url = bruteMessageWithLink.match(facebookRegex);
      client.sendMessage(
        localVariable || message.from,
        "vou tentar baixar esse video ai, lgbt"
      );

      console.log(url[0]);
      downloadVDFacebook(url[0], message);
    }

    if (bruteMessageWithLink.match(twitterRegex)) {
      const url = bruteMessageWithLink.match(twitterRegex);
      client.sendMessage(
        localVariable || message.from,
        "vou tentar baixar esse video ai, lgbt"
      );

      // console.log("o link que vai pro downloadTwitter: ", url );
      downloadTwitter(bruteMessageWithLink, message);
    }

    if (
      bruteMessageWithLink.match(regexURL) &&
      urlsYT.filter((yt) => bruteMessageWithLink.includes(yt))[0]
    ) {
      client.sendMessage(
        localVariable || message.from,
        "vou tentar baixar esse video ai, lgbt"
      );
      const cleanLink = bruteMessageWithLink.match(regexURL)[0];
      downloadVDYoutube(message, cleanLink);
    }
  });
};

module.exports = { runMessageOrchestrator };
