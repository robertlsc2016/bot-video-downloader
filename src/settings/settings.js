const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { browserPath } = require("../settings/necessary-settings");
const { os } = require("os");

const webversion = "2.2413.51-beta-alt";

const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-gpu"],
    headless: true,
    executablePath: browserPath,
  },
  authStrategy: new LocalAuth({
    dataPath: "auth",
  }),
  webVersion: webversion,
  webVersionCache: {
    type: "remote",
    remotePath: `https://raw.githubusercontent.com/guigo613/alternative-wa-version/main/html/${webversion}.html`,
  },
  restartOnAuthFail: true,
});

const initializeClient = () => {
  client.initialize();
};

module.exports = { initializeClient, client };
