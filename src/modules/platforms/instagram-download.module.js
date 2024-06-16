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

    const URLDownload = await getXURL({ url: url });

    if (URLDownload == false) {
      throw new Error("a url de download esta com problemas");
    }

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

const getXURL = async ({ url: rawURL }) => {
  try {
    const XURL = await instagramDl(rawURL);
    const condition = XURL[0].download_link;

    if (condition) {
      return XURL[0].download_link;
    }

    if (condition == false) {
      throw new Error(
        "problema no retorno do link da api getFbVideoInfo. Talvez o link de entrada esteja incorreto ou inválido"
      );
    }
  } catch (error) {
    return false;
  }
};
