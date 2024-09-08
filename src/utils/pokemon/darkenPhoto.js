const sharp = require("sharp");
const logger = require("../../logger");

module.exports.darkenPhoto = async ({ input, output }) => {
  return await sharp(input)
    .raw()
    .ensureAlpha() // Certifica-se de que há um canal alfa (transparência)
    .toBuffer({ resolveWithObject: true })
    .then(async ({ data, info }) => {
      for (let i = 0; i < data.length; i += 4) {
        // Se o canal alfa (data[i + 3]) for maior que 0, significa que há informações
        if (data[i + 3] > 0) {
          // Define a cor como preto (R=0, G=0, B=0)
          data[i] = 0; // Red
          data[i + 1] = 0; // Green
          data[i + 2] = 0; // Blue
        }
      }
      return await sharp(data, {
        raw: { width: info.width, height: info.height, channels: 4 },
      }).toFile(output);
    })
    .then(() => {
      logger.info("Imagem processada com sucesso");
      return;
    })
    .catch((err) => {
      logger.info("Erro ao processar a imagem:", err);
      return;
    });
};
