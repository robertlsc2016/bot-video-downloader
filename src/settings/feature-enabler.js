require("dotenv").config();

const BOTCHATGPTISACTIVE = process.env.BOTCHATGPTISACTIVE || true;
const BOTSTATISTICSISACTIVE = process.env.BOTSTATISTICSISACTIVE || true;
const BOTCOINFLIP = process.env.BOTCOINFLIP || true;
const BOTISTRUE = process.env.BOTISTRUE || true;
const BOTTEXTTOSPEECH = process.env.BOTTEXTTOSPEECH || true;
const BOTTURNINSTICKER = process.env.BOTTURNINSTICKER || true;
const BOTWHOIS = process.env.BOTWHOIS || true;

module.exports = {
  BOTCHATGPTISACTIVE,
  BOTSTATISTICSISACTIVE,
  BOTCOINFLIP,
  BOTISTRUE,
  BOTTEXTTOSPEECH,
  BOTTURNINSTICKER,
  BOTWHOIS,
};
