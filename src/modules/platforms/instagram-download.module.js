const path = require("path");

const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const {
  failureDownloadMessage,
  videosFolderPath,
  platformsNameDownload,
} = require("../../utils/constants");
const instagramDl = require("@sasmeee/igdl");
const { downloadVideo } = require("../../utils/downloadVideo");

module.exports.downloadVDInstagram = async function ({ from: from, url: url }) {
  try {
    const filePath = path.join(
      videosFolderPath,
      platformsNameDownload.instagram
    );

    const getURLDownload = await instagramDl(url);
    // if (getURLDownload.results_number == 0) throw new Error("o link não retornou nada");

    const URLDownload = getURLDownload[0].download_link;

    await downloadVideo({ url: URLDownload, filePath: filePath });
    await genericSendMessageOrchestrator({
      from: from,
      filePath: filePath,
      type: "media",
      isDocument: true,
    });
  } catch (error) {
    console.error("Erro ao baixar o vídeo do instagram:", error);
    await genericSendMessageOrchestrator({
      from: from,
      type: "text",
      msg: failureDownloadMessage,
    });
  }
};
