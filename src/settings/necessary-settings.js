require("dotenv").config();
const os = require("os");
const logger = require("../logger");

const browserPath =
  os.platform().toLocaleLowerCase() == "win32"
    ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
    : os.platform().toLocaleLowerCase() == "linux"
    ? "/usr/bin/google-chrome-stable"
    : undefined;

logger.info(browserPath);
const openIaApiKey = process.env.OPENAI_API_KEY || false;

const prefixBot = process.env.PREFIX_BOT || "/bot";
const activeStatistics = process.env.activeStatistics || true;

const maxDurationYTMs = process.env.MAX_DURATION_TY_MS || "300000";

const instructionChatGPT =
  process.env.INSTRUCTION_GPT ||
  "Você será um bot de um grupo de whatsapp. Você será legal, gentil e responderá as perguntas";
const instructionChatGPTSeriousness =
  process.env.INSTRUCTION_GPT_SERIOUSNESS ||
  "Você será um bot de um grupo de whatsapp e responderá as perguntas de forma acertiva e sucinta. Responda bem a pergunta, mas não use tantas palavras";

module.exports = {
  activeStatistics,
  maxDurationYTMs,
  browserPath,
  openIaApiKey,
  prefixBot,
  instructionChatGPT,
  instructionChatGPTSeriousness,
};
