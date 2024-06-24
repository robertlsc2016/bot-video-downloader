const { client } = require("../../settings/settings");

const fs = require("fs");
const path = require("path");

const ytdl = require("ytdl-core");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const {
  platformsNameDownload,
  failureDownloadMessage,
  videosFolderPathBruteCodecs,
} = require("../../utils/constants");
const { stringToGroup } = require("../../settings/necessary-settings");
const { convertVideo } = require("../../utils/codec-adjuster");

const downloadVDYoutube = async ({ url: url }) => {
  const filePath = path.join(
    videosFolderPathBruteCodecs,
    platformsNameDownload.youtube
  );

  try {
    const videoInfo = await ytdl.getInfo(url);

    const mp4Formats = videoInfo.formats.filter(
      (format) =>
        format.container == "mp4" && format.hasAudio && format.hasVideo
    );
    const videoReadable = ytdl(url, { mp4Formats });

    const writableStream = fs.createWriteStream(filePath);
    videoReadable.pipe(writableStream);

    writableStream
      .on("error", (err) => {
        throw new Error("erro ao salvar o video");
      })

      .on("finish", async () => {
        await genericSendMessageOrchestrator({
          from: stringToGroup,
          filePath: filePath,
          type: "media",
          isDocument: false,
        });
      });
  } catch (err) {
    await genericSendMessageOrchestrator({
      from: stringToGroup,
      msg: failureDownloadMessage,
      type: "text",
    });
  }
};

module.exports = { downloadVDYoutube };
