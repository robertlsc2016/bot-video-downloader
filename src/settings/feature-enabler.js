const { client } = require("./settings");

require("dotenv").config();

const BOTCHATGPTISACTIVE = process.env.BOTCHATGPTISACTIVE ?? true;
const BOTSTATISTICSISACTIVE = process.env.BOTSTATISTICSISACTIVE ?? true;
const BOTCOINFLIP = process.env.BOTCOINFLIP ?? true;
const BOTISTRUE = process.env.BOTISTRUE ?? true;
const BOTTEXTTOSPEECH = process.env.BOTTEXTTOSPEECH ?? true;
const BOTTURNINSTICKER = process.env.BOTTURNINSTICKER ?? true;
const BOTWHOIS = process.env.BOTWHOIS ?? true;
const ISDOCUMENT = process.env.ISDOCUMENT ?? true;
const ADMINSBOT = [process.env.ADMIN_BOT_0, process.env.ADMIN_BOT_1];

module.exports = {
  BOTCHATGPTISACTIVE,
  BOTSTATISTICSISACTIVE,
  BOTCOINFLIP,
  BOTISTRUE,
  BOTTEXTTOSPEECH,
  BOTTURNINSTICKER,
  BOTWHOIS,
  ISDOCUMENT,
  ADMINSBOT,
};
