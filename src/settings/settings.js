const { Client, LocalAuth } = require("whatsapp-web.js");
const { browserPath } = require("./necessary-settings");

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const client = new Client({
  puppeteer: {
    headless: true,
    executablePath: browserPath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-extensions",
      "--disable-dev-shm-usage",
      "--disable-gl",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
      "--disable-ipc-flooding-protection",
    ],
    puppeteer: puppeteer,
  },
  authStrategy: new LocalAuth({
    dataPath: "auth",
  }),
});

const initializeClient = async () => {
  client.initialize();
};

module.exports = { initializeClient, client };
