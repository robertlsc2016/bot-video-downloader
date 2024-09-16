const store = require("../redux/store");
const { BOTTURNINSTICKER } = require("../settings/feature-enabler");
const { prefixBot } = require("../settings/necessary-settings");
const { checkActions } = require("../utils/check-actions");

module.exports.filterValidator = async function ({ typeAction, params = {} }) {
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

    case "ignoreMessageBot": {
      return !(
        (message?._data.id.fromMe &&
          messageBody?.includes("funcionalidades")) ||
        messageBody?.includes("[Bot]")
      );
    }

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
          message._data?.quotedMsg.type == "image")
      );
  }
};
