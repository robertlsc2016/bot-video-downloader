const { runClient } = require("../../config/config");
const { TwitterDL, axios, fs } = require("../../dependencies");
const { localVariable } = require("../../utils/constants");
const { sendVideo } = require("../send-video.module");
const client = runClient();

const downloadTwitter = async (url, message) => {
  // console.log("entrou no baixador do twitter");
  TwitterDL(url)
    .then(async (result) => {
      if (result.status == "error") {
        return client.sendMessage(
          localVariable || message.from,
          "infelizmente, não deu pra baixar seu vídeo, querido. Sinto muito :("
        );
      }
      console.log("o link que vamos baixar é: ", result);
      await axios({
        method: "get",
        url: result.result.media[0].videos[1].url,
        responseType: "stream",
      }).then(async (response) => {
        console.log("dados: ", response);
        const filePath = "x-video.mp4";

        const writer = fs.createWriteStream(`.\\videos\\${filePath}`);
        await response.data.pipe(writer);

        writer.on("finish", async () => {
          sendVideo(message, filePath, false);
        });
      });
    })
    .catch((err) => {
      console.log(err);
      client.sendMessage(
        localVariable || message.from,
        "infelizmente, não deu pra baixar seu vídeo, querido. Sinto muito :("
      );
    });
};

module.exports = { downloadTwitter };
