const {
  genericSendMessageOrchestrator,
} = require("../../generic-sendMessage-orchestrator.module");
const { downloadVideoOrPhoto } = require("../../../utils/downloadVideo");
const logger = require("../../../logger");
const { getInstagramURL } = require("./instagram-getURL.module");
const { pathTo } = require("../../../utils/path-orchestrator");

const filePath = pathTo.medias.videos.bruteCodecsFolder.instagram
const filePathPhoto = pathTo.medias.images.instagram;

module.exports.downloadInstagram = async function ({
  url: url,
  type: type,
  toSend = true,
}) {
  try {
    const path = type == "photo" ? filePathPhoto : filePath;
    const URLDownload = await getInstagramURL({ url: url });

    if (URLDownload == false) {
      throw new Error("a url de download esta com problemas");
    }

    await downloadVideoOrPhoto({
      url: URLDownload,
      filePath: path,
    });

    if (toSend) {
      const finalFilePath = path;

      await genericSendMessageOrchestrator({
        filePath: finalFilePath,
        type: "media",
        isDocument: false,
      });
    }

    return path;
  } catch (error) {
    logger.error("Erro ao baixar o vídeo do instagram:", error);
    await genericSendMessageOrchestrator({
      type: "text",
      situation: "failureDownload",
    });
  }
};
