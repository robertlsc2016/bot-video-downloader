const fs = require("fs");
const path = require("path");

// const ytdl = require("ytdl-core");
const ytdl = require("@distube/ytdl-core");

const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

const { maxDurationYTMs } = require("../../settings/necessary-settings");

const { structuredMessages } = require("../../utils/structured-messages");
const { downloadVideoOrPhoto } = require("../../utils/downloadVideo");
const { convertVideoToAudio } = require("../../utils/convert-video-to-audio");
const { pathTo } = require("../../utils/path-orchestrator");

const downloadVDYoutube = async ({ url: url, mode }) => {
  const filePath = pathTo.medias.videos.bruteCodecsFolder.youtube;
  const outputAudioFilePath = pathTo.medias.audios.audio;

  try {
    const videoInfo = await ytdl.getInfo(url);

    const mp4Formats = videoInfo.formats.filter(
      (format) =>
        format.container == "mp4" && format.hasAudio && format.hasVideo
    );

    if (Number(mp4Formats[0].approxDurationMs) > Number(maxDurationYTMs)) {
      console.error("a duração do video/audio é maior que 5 minutos");
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

      if (mode == "extractAudio") {
        await convertVideoToAudio({ path: filePath });
        return await genericSendMessageOrchestrator({
          filePath: outputAudioFilePath,
          type: "media",
          isDocument: false,
        });
      }

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
