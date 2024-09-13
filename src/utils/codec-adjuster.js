const ffmpeg = require("fluent-ffmpeg");
const { pathTo } = require("./path-orchestrator");

module.exports.convertVideo = async function ({
  input: input,
  platform: platform,
}) {
  const outputPath = pathTo.medias.videos.ajustedCodecsFolder.youtube;
  async function convertForWhatsApp() {
    return new Promise(async (resolve, reject) => {
      ffmpeg(input)
        .videoCodec("libx264") // Codec de vídeo H.264
        .audioCodec("aac") // Codec de áudio AAC
        .format("mp4") // Formato MP4
        .outputOptions("-preset", "ultrafast") // Use a predefinição mais rápida para libx264
        .outputOptions("-crf", "30") // Aumenta o CRF para reduzir o tempo de codificação (pior qualidade)
        .outputOptions("-movflags", "faststart") // Habilita início rápido para streaming
        .outputOptions("-tune", "zerolatency") // Otimiza para latência mínima, útil para velocidade
        .output("output.mp4")
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
