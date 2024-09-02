const fs = require("fs");
const path = require("path");

// const ytdl = require("ytdl-core");
const ytdl = require("@distube/ytdl-core");

const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const {
  platformsNameDownload,
  videosFolderPathBruteCodecs,
  videosFolderPathAjustedCodecs,
} = require("../../utils/constants");
const {
  stringToGroup,
  maxDurationYTMs,
} = require("../../settings/necessary-settings");
const { convertVideo } = require("../../utils/codec-adjuster");
const { structuredMessages } = require("../../utils/structured-messages");
const { downloadVideoOrPhoto } = require("../../utils/downloadVideo");

const downloadVDYoutube = async ({ url: url }) => {
  const filePath = path.join(
    videosFolderPathBruteCodecs,
    platformsNameDownload.youtube
  );

  const outputPath = path.join(
    videosFolderPathAjustedCodecs,
    platformsNameDownload.youtube
  );

  try {
    const videoInfo = await ytdl.getInfo(url);

    const mp4Formats = videoInfo.formats.filter(
      (format) =>
        format.container == "mp4" && format.hasAudio && format.hasVideo
    );

    if (Number(mp4Formats[0].approxDurationMs) > Number(maxDurationYTMs)) {
      console.error("a duração do video é maior que 5 minutos");
      throw new Error(structuredMessages.YTVideoDurationExceededMessage);
    }

    if (mp4Formats[0].length == 0) {
      throw new Error(structuredMessages.incompatibleFormat);
    }

    if (mp4Formats.length > 0) {
      await downloadVideoOrPhoto({
        url: mp4Formats[0].url,
        filePath: filePath,
      });

      await genericSendMessageOrchestrator({
        filePath: filePath,
        type: "media",
        isDocument: false,
      });
    }
  } catch (error) {
    await genericSendMessageOrchestrator({
      type: "text",
      msg: "Não foi possível baixar o vídeo, sinto muito :(",
    });
  }
};

module.exports = { downloadVDYoutube };
