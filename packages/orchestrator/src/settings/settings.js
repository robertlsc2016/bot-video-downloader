const { Client, LocalAuth } = require("whatsapp-web.js");
const { browserPath } = require("./necessary-settings");
const { os } = require("os");

const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-gpu"],
    headless: true,
    executablePath: browserPath,
  },
  authStrategy: new LocalAuth({
    dataPath: "auth",
  }),
});

const initializeClient = () => {
  client.initialize();
};

module.exports = { initializeClient, client };
