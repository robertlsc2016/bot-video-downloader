const { os, Client, LocalAuth, qrcode } = require("../dependencies");

const webversion = "2.2412.54v2";

const OS =
  os.platform() == "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "/usr/bin/google-chrome-stable";

const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-gpu"],
    headless: true,
    executablePath:
      "C:\\Users\\Robert Luiz\\AppData\\Local\\Programs\\Opera\\opera.exe",
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



const runClient = () => {
  return client;
};

client.initialize();

module.exports = { runClient, client };
