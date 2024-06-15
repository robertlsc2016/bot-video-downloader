const path = require("path");
const { downloadVideo } = require("../../utils/downloadVideo");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const {
  failureDownloadMessage,
  platformsNameDownload,
  videosFolderPath,
} = require("../../utils/constants");

const TikChan = require("tikchan");

module.exports.downloadVDTiktok = async function ({ from: from, url: url }) {
  try {
    console.log("url que ta chegando:", url)
    const filePath = path.join(videosFolderPath, platformsNameDownload.tiktok);

    const getURLDownload = await TikChan.download(url);
    console.log(getURLDownload);
    if (getURLDownload.no_wm == false)
      throw new Error("retornou undefined no no_wm");

    const URLDownload = getURLDownload.no_wm;

    await downloadVideo({ url: URLDownload, filePath: filePath });
    await genericSendMessageOrchestrator({
      from: from,
      filePath: filePath,
      type: "media",
      isDocument: true
    });
  } catch (error) {
    console.error("Erro ao baixar o vídeo tiktok:", error);
    await genericSendMessageOrchestrator({
      from: from,
      type: "text",
      msg: failureDownloadMessage,
    });
  }
};
