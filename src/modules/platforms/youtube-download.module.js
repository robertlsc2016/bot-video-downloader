const { client } = require("../../settings/settings");

const fs = require("fs");
const path = require("path");

const ytdl = require("ytdl-core");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const {
  videosFolderPath,
  platformsNameDownload,
} = require("../../utils/constants");

const downloadVDYoutube = async (from, cleanLink) => {
  const filePath = path.join(videosFolderPath, platformsNameDownload.youtube);

  try {
    console.log("entrou no try")
    const isValid = await validateMimeType(cleanLink);

    if (isValid) {
      console.log("is valid")

      const videoReadable = ytdl(cleanLink, {
        filter: (format) => format.container == "mp4",
      });

      console.log(videoReadable)

      const writableStream = fs.createWriteStream(filePath);
      videoReadable.pipe(writableStream);

      writableStream
        .on("error", (err) => {
          throw new Error("erro ao salvar o video");
        })

        .on("finish", async () => {
          console.log("terminei de baixar, vou fazer o envio");

          await genericSendMessageOrchestrator({
            from: from,
            filePath: filePath,
            type: "media",
            isDocument: false,
          });
        });
    } else {
      throw new Error("mimetype não valido");
    }
  } catch (err) {
    return client.sendMessage(
      from,
      "infelizmente, não deu pra baixar seu vídeo, querido. Sinto muito :("
    );
  }
};

const validateMimeType = async (url) => {
  const infos = await ytdl.getBasicInfo(url);
  let formats = ytdl.chooseFormat(infos.formats);

  console.log("entrou aq")

  // console.log(infos);

  // if (!infos.formats) {
  //   throw new Error("o video não tem o formato valido");
  // }

  // if (infos.formats[1].mimeType.indexOf("video/mp4") == -1) {
  //   throw new Error("mimetype não valido | mimetype: ", infos.formats.mimeType);
  // }

  return true;
};

module.exports = { downloadVDYoutube };
