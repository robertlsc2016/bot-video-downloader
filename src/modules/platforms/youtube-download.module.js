const { runClient } = require("../../config/config");
const { fs, ytdl } = require("../../dependencies");
const { localVariable } = require("../../utils/constants");
const { sendVideo } = require("../send-video.module");
const client = runClient();

const downloadVDYoutube = async (message, cleanLink) => {
  const filePath = "youtube-video.mp4";

  try {
    const isValid = await validateMimeType(cleanLink);
    if (isValid) {
      const videoReadable = ytdl(cleanLink, { quality: "lowest" }).on(
        "end",
        () => {
          console.log("terminei de baixar mano");
        }
      );

      const writableStream = fs.createWriteStream(`.\\videos\\${filePath}`);
      videoReadable.pipe(writableStream);

      writableStream
        .on("error", (err) => {
          throw new Error("erro ao salvar o video");
        })
        .on("finish", async () => {
          return sendVideo(message, filePath, false);
        });
    } else {
      throw new Error("mimetype não valido");
    }
  } catch (err) {
    console.log(err);
    return client.sendMessage(
      localVariable || message.from,
      "infelizmente, não deu pra baixar seu vídeo, querido. Sinto muito :("
    );
  }
};

const validateMimeType = async (url) => {
  const infos = await ytdl.getBasicInfo(url);
  
  if (!infos.formats) {
    throw new Error("o video não tem o formato valido");
  }

  if (infos.formats[1].mimeType.indexOf("video/mp4") == -1) {
    throw new Error("mimetype não valido");
  }

  return true;
};

module.exports = { downloadVDYoutube };
