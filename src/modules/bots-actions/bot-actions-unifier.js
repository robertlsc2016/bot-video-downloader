const { botApiNasa } = require("./bot-api-nasa");
const { botChatGpt } = require("./bot-chatgpt");
const { bothelp } = require("./bot-help");
const {
  showStatistics,
  addParticipation,
  resetStatistics,
} = require("./bot-statistics");

const { usageMonitor } = require("./bot-usage-monitor");
const { headsOrTails } = require("./coin_flip");
const { IsTrue } = require("./is-true");
const { mentionAll } = require("./mention-all");
const { rootBotActions } = require("./root-bot-actions");
const { speedTest } = require("./speed-test");
const { textToSpeech } = require("./text-to-speech");
const { turnInSticker } = require("./turn-in-sticker");
const {
  whoIsThisPokemon,
  alreadyPokemon,
  pokemonSolved,
} = require("./who-is-that-pokemon");
const { whoIs } = require("./who-is");
const { fortuneBot } = require("./fortune-bot");

module.exports = {
  fortuneBot,
  rootBotActions,
  speedTest,
  whoIsThisPokemon,
  alreadyPokemon,
  pokemonSolved,
  botApiNasa,
  headsOrTails,
  bothelp,
  turnInSticker,
  whoIs,
  IsTrue,
  textToSpeech,
  botChatGpt,
  showStatistics,
  addParticipation,
  resetStatistics,
  usageMonitor,
  mentionAll,
};
