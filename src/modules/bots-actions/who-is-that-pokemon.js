const path = require("path");

const { getPokemon } = require("../../utils/pokemon/getPokemon");
const { darkenPhoto } = require("../../utils/pokemon/darkenPhoto");
const { mergePhoto } = require("../../utils/pokemon/mergePhoto");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

const { sendPhotoPokemon } = require("../../utils/pokemon/sendPhoto");
const { botChatGpt } = require("./bot-chatgpt");
const store = require("../../redux/store");
const { pathTo } = require("../../utils/path-orchestrator");
const { monitorUsageActions } = require("../../utils/monitor-usage-actions");

const pathInput_PokemonPhoto = pathTo.medias.images.pokemonsMedia.pokemon;
const pathDarkened_PokemonPhoto =
  pathTo.medias.images.pokemonsMedia.pokemon_darkened;
const pathMergedPhotos = pathTo.medias.images.pokemonsMedia.merged_normal;
const pathMergedPhotosDarkened =
  pathTo.medias.images.pokemonsMedia.merged_darkened;

const whoIsThisPokemon = async () => {
  monitorUsageActions({
    action: "who_is_that_pokemon",
  });
  await genericSendMessageOrchestrator({
    type: "text",
    msg: "Opa! Um momento, vou pegar um Pokemón para você! Aguarde um momento!",
  });

  await getPokemon();

  await darkenPhoto({
    input: pathInput_PokemonPhoto,
    output: pathDarkened_PokemonPhoto,
  });

  await mergePhoto({
    input: pathDarkened_PokemonPhoto,
    output: pathMergedPhotosDarkened,
    background: 1,
  });

  await mergePhoto({
    input: pathInput_PokemonPhoto,
    output: pathMergedPhotos,
    background: 2,
  });

  setTimeout(async () => {
    const pokemonName = store.getState().pokemon.valid_pokemon;
    await botChatGpt({
      msg: pokemonName,
      pokemonTip: true,
      toSend: false,
      seriousness: "high",
    });

    await sendPhotoPokemon({
      situation: "STARTED",
      path: pathMergedPhotosDarkened,
    });
  }, 2000);
};

const alreadyPokemon = async () => {
  return await genericSendMessageOrchestrator({
    type: "media",
    textMedia: false,
    filePath: pathMergedPhotosDarkened,
    msg: "Já existe uma quest de pokemon iniciada! Tente acertar ;)",
  });
};

const pokemonSolved = async () => {
  return await sendPhotoPokemon({
    situation: "SOLVED",
    path: pathMergedPhotos,
  });
};

module.exports = {
  whoIsThisPokemon,
  alreadyPokemon,
  pokemonSolved,
};
