const sharp = require("sharp");
const path = require("path");
const logger = require("../../logger");

const pathBackground_Photo_1 = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "images",
  "pokemons-media",
  "background1.png"
);

const pathBackground_Photo_2 = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "images",
  "pokemons-media",
  "background2.png"
);

module.exports.mergePhoto = async ({ input, output, background }) => {
  return await sharp(input)
    // .resize(200, 200)

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
            // console.error("Erro ao mesclar imagens:", err);
          } else {
            logger.info("Imagem criada com sucesso");
            return;
            // console.log("Imagem criada com sucesso:", info);
          }
        });
    })
    .catch((error) => {
      console.error("Erro durante o processamento:", error);
    });
};
