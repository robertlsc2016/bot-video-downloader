const path = require("path");
const { downloadVideo } = require("../../utils/downloadVideo");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const {
  failureDownloadMessage,
  platformsNameDownload,
  videosFolderPath,
  videosFolderPathAjustedCodecs,
  videosFolderPathBruteCodecs,
} = require("../../utils/constants");

const TikChan = require("tikchan");
const { convertVideo } = require("../../utils/codec-adjuster");

module.exports.downloadVDTiktok = async function ({ from: from, url: url }) {
  try {
    const filePath = path.join(
      videosFolderPathBruteCodecs,
      platformsNameDownload.tiktok
    );

    const outputPath = path.join(
      videosFolderPathAjustedCodecs,
      platformsNameDownload.tiktok
    );

    const URLDownload = await getXURL({ url: url });

    if (URLDownload == false)
      throw new Error("a url de download esta com problemas");

    await downloadVideo({ url: URLDownload, filePath: filePath });

    await convertVideo({
      input: filePath,
      platform: platformsNameDownload.tiktok,
    });

    await genericSendMessageOrchestrator({
      from: from,
      filePath: outputPath,
      type: "media",
      isDocument: false,
    });
  } catch (error) {
    console.error("Erro ao baixar o vídeo tiktok:", error);
    await genericSendMessageOrchestrator({
      type: "text",
      situation: "failureDownload",
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
