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
    const filePath = path.join(videosFolderPath, platformsNameDownload.tiktok);
    const URLDownload = await getXURL({ url: url });

    if (URLDownload == false) throw new Error("a url de download esta com problemas");

    await downloadVideo({ url: URLDownload, filePath: filePath });
    await genericSendMessageOrchestrator({
      from: from,
      filePath: filePath,
      type: "media",
      isDocument: true,
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

const getXURL = async ({ url: rawURL }) => {
  try {
    const URL = await TikChan.download(rawURL);
    const condition = URL.no_wm;

    if (condition) {
      return URL.no_wm;
    }

    if (condition == false) {
      throw new Error(
        "problema no retorno do link da api TikChan. Talvez o link de entrada esteja incorreto ou inválido"
      );
    }
  } catch (error) {
    return false;
  }
};
