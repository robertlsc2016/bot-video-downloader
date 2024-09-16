const sharp = require("sharp");
const path = require("path");
const logger = require("../../logger");
const { pathTo } = require("../path-orchestrator");

const pathBackground_Photo_1 = pathTo.medias.images.pokemonsMedia.pokemonsBg1;
const pathBackground_Photo_2 = pathTo.medias.images.pokemonsMedia.pokemonsBg2;

module.exports.mergePhoto = async ({ input, output, background }) => {
  return await sharp(input)
    .resize(background == 1 ? 200 : 250, background == 1 ? 200 : 250)
    .toBuffer()
    .then((resizedOverlayBuffer) => {
      return sharp(
        background == 1 ? pathBackground_Photo_1 : pathBackground_Photo_2
      )
        .composite([
          {
            input: resizedOverlayBuffer,
            blend: "over",
            left: background == 1 ? -20 : 174,
            top: background == 1 ? -5 : 62,
          },
        ])
        .toFile(output, (err, info) => {
          if (err) {
            logger.error("Erro ao mesclar imagens");
            return;
          } else {
            logger.info("Imagem criada com sucesso");
            return;
          }
        });
    })
    .catch((error) => {
      console.error("Erro durante o processamento:", error);
    });
};
