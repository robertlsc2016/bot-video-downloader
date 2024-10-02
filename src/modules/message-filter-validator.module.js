const store = require("../redux/store");
const {
  BOTTURNINSTICKER,
  BOTCHATGPTISACTIVE,
  BOTWHOIS,
  BOTISTRUE,
} = require("../settings/feature-enabler");
const { prefixBot } = require("../settings/necessary-settings");
const { checkActions } = require("../utils/check-actions");
const { bot_actions } = require("../utils/constants");

const messageFilterValidator = async function ({ typeAction, params = {} }) {
  const { messageBody, message, ADMINSBOT } = params;

  switch (typeAction) {
    case "turnOff":
      return (
        messageBody.includes(`${prefixBot} turn off`) &&
        !messageBody.includes("[Bot]") &&
        ADMINSBOT.includes(message._data.id.participant)
      );

    case "turnOn":
      return (
        messageBody.includes(`${prefixBot} turn on`) &&
        !messageBody.includes("[Bot]") &&
        ADMINSBOT.includes(message._data.id.participant)
      );

    case "botIsOff": {
      return (
        messageBody.includes(`${prefixBot} `) &&
        !(await checkActions({ typeAction: "bot_active" }))
      );
    }

    case "resetStatistics":
      return (
        messageBody.includes(`${prefixBot} reset statistics`) &&
        ADMINSBOT.includes(message._data.id.participant)
      );

    case "ignoreMessageBot": {
      return !(
        (message?._data.id.fromMe &&
          messageBody?.includes("funcionalidades")) ||
        messageBody?.includes("[Bot]")
      );
    }

    case "sky-image":
      return (
        messageBody.includes(`${prefixBot} foto do ceu em`) ||
        messageBody.includes(`${prefixBot} foto do céu em`)
      );

    case "whoIsThatPokemon":
      return messageBody.includes(`${prefixBot} quem é esse pokemon?`);

    case "pokemonIsSolved":
      return (
        store.getState().pokemon.status == "STARTED" &&
        messageBody
          .toLowerCase()
          .includes(store.getState().pokemon.valid_pokemon)
      );

    case "mentionAll":
      return messageBody.includes("@todos");

    case "turnInStickerImageOrAnswered":
      return (
        BOTTURNINSTICKER == "true" &&
        (message?._data?.caption?.includes(bot_actions.bot_sticker) ||
          messageBody.includes(bot_actions.bot_sticker)) &&
        (message?._data?.type == "image" ||
          message._data?.quotedMsg?.type == "image")
      );

    case "gptReally":
      return (
        (BOTCHATGPTISACTIVE == "true" || BOTCHATGPTISACTIVE) &&
        messageBody.includes(bot_actions.pre_questions_chatgpt_bot_really)
      );

    case "gptFunny":
      return (
        BOTCHATGPTISACTIVE == "true" &&
        messageBody.includes(bot_actions.pre_questions_chatgpt_bot)
      );

    case "whoIs": {
      return (
        (BOTWHOIS == "true" || BOTWHOIS) &&
        messageBody?.includes(bot_actions.who_is)
      );
    }

    case "turnonSpeedTest":
      return messageBody?.includes(`${prefixBot} speedtest turn on`);

    case "turnoffSpeedTest":
      return messageBody?.includes(`${prefixBot} speedtest turn off`);

    case "speedtest":
      return (
        (await checkActions({ typeAction: "bot_speedtest" })) &&
        messageBody?.includes(`${prefixBot} speedtest`)
      );

    case "isTrue":
      return BOTISTRUE == "true" && messageBody?.includes(bot_actions.is_true);

    case "usageMonitor":
      return messageBody.includes(`${prefixBot} usage monitor`);

    case "imageAnswered":
      return (
        message._data?.quotedMsg && message._data?.quotedMsg.type == "image"
      );
  }
};

module.exports = {
  messageFilterValidator,
};
