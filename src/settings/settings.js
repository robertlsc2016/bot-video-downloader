const { Client, LocalAuth } = require("whatsapp-web.js");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const client = new Client({
  puppeteer: {
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
