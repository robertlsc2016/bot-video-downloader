const axios = require("axios");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const { getPokemon } = require("../../utils/pokemon/getPokemon");
const { darkenPhoto } = require("../../utils/pokemon/darkenPhoto");
const { mergePhoto } = require("../../utils/pokemon/mergePhoto");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const { sendPhotoPokemon } = require("../../utils/pokemon/sendPhoto");
const { botChatGpt } = require("./bot-chatgpt");
const store = require("../../redux/store");

const rootPathPokemonFiles = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "images",
  "pokemons-media"
);

const pathInput_PokemonPhoto = path.resolve(
  rootPathPokemonFiles,
  "pokemon.png"
);
const pathDarkened_PokemonPhoto = path.resolve(
  rootPathPokemonFiles,
  "pokemon_darkened.png"
);
const pathMergedPhotos = path.resolve(
  rootPathPokemonFiles,
  "merged_normal.png"
);

const pathMergedPhotosDarkened = path.resolve(
  rootPathPokemonFiles,
  "merged_darkened.png"
);

module.exports.whoIsThisPokemon = async function () {
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
