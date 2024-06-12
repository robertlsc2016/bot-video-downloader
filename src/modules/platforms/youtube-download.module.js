const { runClient } = require("../../config/config");
const { fs, ytdl } = require("../../dependencies");
const { localVariable } = require("../../utils/constants");
const { sendVideo } = require("../send-video.module");
const client = runClient();

const downloadVDYoutube = async (message, cleanLink) => {
  console.log("entrou no youtube");

  const filePath = "youtube-video.mp4";

  try {
    const videvalid = await ytdl.getBasicInfo(cleanLink);
    const videoReadable = ytdl(cleanLink, { quality: "lowest" });
    const writableStream = fs.createWriteStream(`.\\videos\\${filePath}`);

    videoReadable.pipe(writableStream);

    writableStream.on("error", (err) => {
      console.error("Erro ao salvar o vídeo:", err);
    });

    writableStream.on("finish", async () => {
      sendVideo(message, filePath, false);
    });
  } catch (err) {
    console.log("erro ao baixar video do youtube: ", err);
    client.sendMessage(
      localVariable || message.from,
      "infelizmente, não deu pra baixar seu vídeo, querido. Sinto muito :("
    );
  }
};

module.exports = { downloadVDYoutube };
