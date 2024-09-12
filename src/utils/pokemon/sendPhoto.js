const {
  genericSendMessageOrchestrator,
} = require("../../modules/generic-sendMessage-orchestrator.module");
const { complete_WhosThatPokemon } = require("../../redux/actions/actions");
const store = require("../../redux/store");

module.exports.sendPhotoPokemon = async function ({ situation, path }) {
  const tip = store.getState().pokemon.tip;
  const pokemonName = store.getState().pokemon.valid_pokemon;

  switch (situation) {
    case "STARTED":
      return await genericSendMessageOrchestrator({
        type: "media",
        textMedia: false,
        msg: `Quem é esse pokemon??\n\n*Inicial do Pokémon:* ${pokemonName[0].toUpperCase()}\n\n*Dica:* ${tip}`,
        filePath: path,
      });

    case "SOLVED":
      await genericSendMessageOrchestrator({
        type: "media",
        textMedia: false,
        msg: `${
          store.getState().pokemon.valid_pokemon
        }!!!* Você acertou o pokemon!`,
        filePath: path,
      });
      return store.dispatch(complete_WhosThatPokemon());
  }
};
