const { downloadVideoOrPhoto } = require("../../../utils/downloadVideo");
const {
  genericSendMessageOrchestrator,
} = require("../../generic-sendMessage-orchestrator.module");

const { pathTo } = require("../../../utils/path-orchestrator");
const {
  convertVideoToAudio,
} = require("../../../utils/convert-video-to-audio");
const { getTiktokURL } = require("./tiktok-getURL.module");
const { monitorUsageActions } = require("../../../utils/monitor-usage-actions");
const logger = require("../../../logger");

const filePathVideo = pathTo.medias.videos.bruteCodecsFolder.tiktok;
const filePathAudio = pathTo.medias.audios.audio;

const downloadVDTiktok = async function ({ url, mode, send = true }) {
  try {
    monitorUsageActions({
      action: "tiktok_download_video",
    });

    const URLDownload = await getTiktokURL({ url: url });

    if (URLDownload == false)
      throw new Error("a url de download esta com problemas");

    await downloadVideoOrPhoto({ url: URLDownload, filePath: filePathVideo });

    if (mode == "extractAudio") {
      await convertVideoToAudio({ path: filePathVideo });
      return await genericSendMessageOrchestrator({
        filePath: filePathAudio,
        type: "media",
        isDocument: false,
      });
    }

    if (send) {
      return await genericSendMessageOrchestrator({
        filePath: filePathVideo,
        type: "media",
        isDocument: false,
      });
    }
  } catch (error) {
    logger.error("Erro ao baixar o vídeo tiktok:", error);
    await genericSendMessageOrchestrator({
      type: "text",
      situation: "failureDownload",
    });
  }
};

module.exports = {
  downloadVDTiktok,
};
