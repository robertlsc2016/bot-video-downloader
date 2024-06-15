const { client } = require("../../settings/settings");

const fs = require("fs");
const path = require("path");

const ytdl = require("ytdl-core");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

const downloadVDYoutube = async (from, cleanLink) => {
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "videos",
    "youtube-video.mp4"
  );

  try {
    const isValid = await validateMimeType(cleanLink);
    if (isValid) {
      console.log("o link é vlaido? ", isValid);
      console.log(filePath);
      const videoReadable = ytdl(cleanLink, { quality: "lowest" });

      const writableStream = fs.createWriteStream(filePath);
      videoReadable.pipe(writableStream);

      writableStream
        .on("error", (err) => {
          throw new Error("erro ao salvar o video");
        })
        .on("finish", async () => {
          await genericSendMessageOrchestrator({
            from: from,
            filePath: filePath,
            type: "media",
          });
        });
    } else {
      throw new Error("mimetype não valido");
    }
  } catch (err) {
    console.log(err);
    return client.sendMessage(
      message.from,
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
    throw new Error("mimetype não valido | mimetype: ", infos.formats.mimeType);
  }

  return true;
};

module.exports = { downloadVDYoutube };
