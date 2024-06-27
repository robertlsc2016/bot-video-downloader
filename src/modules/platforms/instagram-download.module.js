const path = require("path");

const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const {
  failureDownloadMessage,
  videosFolderPath,
  platformsNameDownload,
  videosFolderPathAjustedCodecs,
  videosFolderPathBruteCodecs,
} = require("../../utils/constants");
const instagramDl = require("@sasmeee/igdl");
const { downloadVideo } = require("../../utils/downloadVideo");
const { convertVideo } = require("../../utils/codec-adjuster");

module.exports.downloadVDInstagram = async function ({ from: from, url: url }) {
  try {
    const filePath = path.join(
      videosFolderPathBruteCodecs,
      platformsNameDownload.instagram
    );

    const outputPath = path.join(
      videosFolderPathAjustedCodecs,
      platformsNameDownload.instagram
    );

    const URLDownload = await getXURL({ url: url });

    if (URLDownload == false) {
      throw new Error("a url de download esta com problemas");
    }

    await downloadVideo({ url: URLDownload, filePath: filePath });
    await convertVideo({
      input: filePath,
      platform: platformsNameDownload.instagram,
    });

    await genericSendMessageOrchestrator({
      from: from,
      filePath: outputPath,
      type: "media",
      isDocument: false,
    });
  } catch (error) {
    console.error("Erro ao baixar o vídeo do instagram:", error);
    await genericSendMessageOrchestrator({
      type: "text",
      situation: "failureDownload",
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
