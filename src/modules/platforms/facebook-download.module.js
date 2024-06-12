const { getFbVideoInfo, axios, fs } = require("../../dependencies");
const { runClient } = require("../../config/config");
const { localVariable } = require("../../utils/constants");
const { sendVideo } = require("../send-video.module");

const client = runClient();

const downloadVDFacebook = async (url, message) => {
  try {
    console.log("entrou no facebook");
    const filePath = "facebook-video.mp4";

    await getFbVideoInfo(url).then(async (result) => {
      await axios({
        method: "get",
        url: result.sd,
        responseType: "stream",
      }).then(async (response) => {
        const writer = fs.createWriteStream(`.\\videos\\${filePath}`);
        await response.data.pipe(writer);

        writer.on("finish", async () => {
          try {
            sendVideo(message, filePath, true);
          } catch (error) {
            console.error("Erro ao limpar o vídeo ou enviar o vídeo:", error);

            client.sendMessage(
              localVariable || message.from,
              "infelizmente, não deu pra baixar seu vídeo, querido. Sinto muito :("
            );
          }
        });
      });
    });
  } catch (error) {
    console.error("Erro ao baixar o vídeo:", error);
    client.sendMessage(
      localVariable || message.from,
      "infelizmente, não deu pra baixar seu vídeo, querido. Sinto muito :("
    );
  }
};

module.exports = { downloadVDFacebook };
