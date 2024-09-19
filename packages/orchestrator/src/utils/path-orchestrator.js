const path = require("path");
const { platformsNameDownload } = require("./constants");

const rooPath = path.join(__dirname, "..", "..");
const rooPathPokemonMedia = path.join(
  rooPath,
  "medias",
  "images",
  "pokemons-media"
);

const pathTo = {
  pathToStatesJson: path.join(rooPath, "data", "states.json"),
  pathToStatisticJson: path.join(rooPath, "data", "statistics.json"),

  medias: {
    audios: {
      pathFolder: path.join(rooPath, "medias", "audios"),
      audio: path.join(rooPath, "medias", "audios", "audio.mp3"),
      youtube: path.join(
        rooPath,
        "medias",
        "audios",
        platformsNameDownload.youtubeAudio
      ),
    },
    videos: {
      bruteCodecsFolder: {
        pathFolder: path.join(rooPath, "medias", "videos", "brute-codecs"),
        tiktok: path.join(
          rooPath,
          "medias",
          "videos",
          "brute-codecs",
          platformsNameDownload.tiktok
        ),
        x: path.join(
          rooPath,
          "medias",
          "videos",
          "brute-codecs",
          platformsNameDownload.x
        ),
        youtube: path.join(
          rooPath,
          "medias",
          "videos",
          "brute-codecs",
          platformsNameDownload.youtube
        ),
        facebook: path.join(
          rooPath,
          "medias",
          "videos",
          "brute-codecs",
          platformsNameDownload.facebook
        ),

        pintrest: path.join(
          rooPath,
          "medias",
          "videos",
          "brute-codecs",
          platformsNameDownload.pinterestVideo
        ),
        instagram: path.join(
          rooPath,
          "medias",
          "videos",
          "brute-codecs",
          platformsNameDownload.instagram
        ),
      },
      ajustedCodecsFolder: {
        pathFolder: path.join(rooPath, "medias", "videos", "ajusted-codecs"),
        youtube: path.join(
          rooPath,
          "medias",
          "videos",
          "ajusted-codecs",
          platformsNameDownload.youtube
        ),
      },
    },
    images: {
      imagesFolder: path.join(rooPath, "medias", "images"),
      pokemonsMedia: {
        pokemonsMediaFolder: rooPathPokemonMedia,
        pokemonsBg1: path.join(rooPathPokemonMedia, "bg1.png"),
        pokemonsBg2: path.join(rooPathPokemonMedia, "bg2.png"),
        pokemonsBg3: path.join(rooPathPokemonMedia, "bg3.png"),
        pokemon: path.join(rooPathPokemonMedia, "pokemon.png"),
        pokemon_darkened: path.join(
          rooPathPokemonMedia,
          "pokemon_darkened.png"
        ),
        merged_normal: path.join(rooPathPokemonMedia, "merged_normal.png"),
        merged_darkened: path.join(rooPathPokemonMedia, "merged_darkened.png"),
      },

      instagram: path.join(
        rooPath,
        "medias",
        "images",
        platformsNameDownload.instagramPhoto
      ),
      facebook: path.join(
        rooPath,
        "medias",
        "images",
        platformsNameDownload.facebookPhoto
      ),
      pintrest: path.join(
        rooPath,
        "medias",
        "images",
        platformsNameDownload.pinterestPhoto
      ),
    },
  },
};

module.exports = {
  pathTo,
};
