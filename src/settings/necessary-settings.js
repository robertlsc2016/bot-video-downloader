require("dotenv").config();

const browserPath = process.env.PATH_BROWSER;
const stringToGroup = process.env.STRING_TO_GROUP_WWEBJS;
const openIaApiKey = process.env.OPENAI_API_KEY || false
const shippingAllowed = process.env.SHIPPING_ALLLOWED || true;
const prefixBot = process.env.PREFIX_BOT || "/bot";
const activeStatistics = process.env.activeStatistics || true;

const maxDurationYTMs = process.env.MAX_DURATION_TY_MS || "300000";

const instructionChatGPT = process.env.INSTRUCTION_GPT || "Você será um bot de um grupo de whatsapp. Você será legal, gentil e responderá as perguntas"

module.exports = {
  activeStatistics,
  maxDurationYTMs,
  browserPath,
  shippingAllowed,
  openIaApiKey,
  stringToGroup,
  prefixBot,
  instructionChatGPT
};
