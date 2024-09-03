const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const { audiosPathFolder } = require("./constants");

const outputFilePath = path.join(audiosPathFolder, "audio.mp3");

module.exports.convertVideoToAudio = async function ({ path }) {
  async function convertVideoToAudio() {
    console.log("Iniciando conversão!");

    return new Promise(async (resolve, reject) => {
      ffmpeg(path)
        .noVideo() // Remove o fluxo de vídeo
        .audioCodec("libmp3lame") // Usa o codec MP3
        .on("end", () => {
          console.log("Conversão concluída!");
          resolve();
        })
        .on("error", (err) => {
          console.error("Ocorreu um erro:", err);
          reject(err);
        })
        .save(outputFilePath);
    });
  }

  await convertVideoToAudio()
    .then(() => {
      console.log("Conversão de vídeo para audio completa!");
    })
    .catch((error) => {
      console.error("Falha na conversão de vídeo para audio:", error);
    });
};
