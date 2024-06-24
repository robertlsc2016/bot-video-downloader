const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const {
  videosFolderPath,
  platformsNameDownload,
  videosFolderPathAjustedCodecs,
} = require("./constants");

module.exports.convertVideo = async function ({
  input: input,
  platform: platform,
}) {
  const outputPath = path.join(videosFolderPathAjustedCodecs, platform);

  async function convertForWhatsApp() {
    return new Promise(async (resolve, reject) => {
      ffmpeg(input)
        .videoCodec("libx264") // Codec de vídeo H.264
        .audioCodec("aac") // Codec de áudio AAC
        .format("mp4") // Formato MP4
        .outputOptions("-preset", "fast") // Ajuste a predefinição para velocidade
        .outputOptions("-movflags", "faststart") // Habilita início rápido para streaming
        .on("end", () => {
          resolve();
        })
        .on("error", (err) => {
          console.error("Erro na conversão:", err);
          reject(err);
        })
        .save(outputPath);
    });
  }

  await convertForWhatsApp(input, outputPath)
    .then(() => {
      console.log("Conversão de vídeo completa!");
    })
    .catch((error) => {
      console.error("Falha na conversão de vídeo:", error);
    });
};
