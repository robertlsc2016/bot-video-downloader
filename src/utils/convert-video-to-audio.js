const ffmpeg = require("fluent-ffmpeg");
const { pathTo } = require("./path-orchestrator");
const logger = require("../logger");
const outputFilePath = pathTo.medias.audios.audio;

module.exports.convertVideoToAudio = async function ({ path }) {
  async function convertVideoToAudio() {
    logger.info("Iniciando conversão!");

    return new Promise(async (resolve, reject) => {
      ffmpeg(path)
        .noVideo() // Remove o fluxo de vídeo
        .audioCodec("libmp3lame") // Usa o codec MP3
        .on("end", () => {
          logger.info("Conversão concluída!");
          resolve();
        })
        .on("error", (err) => {
          logger.error("Ocorreu um erro:", err);
          reject(err);
        })
        .save(outputFilePath);
    });
  }

  await convertVideoToAudio()
    .then(() => {
      logger.info("Conversão de vídeo para audio completa!");
    })
    .catch((error) => {
      logger.error("Falha na conversão de vídeo para audio:", error);
    });
};
