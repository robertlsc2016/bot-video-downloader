const path = require("path");
const getFbVideoInfo = require("fb-downloader-scrapper");
const { downloadVideo } = require("../../utils/downloadVideo");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const {
  videosFolderPath,
  platformsNameDownload,
  failureDownloadMessage,
  videosFolderPathAjustedCodecs,
  videosFolderPathBruteCodecs,
} = require("../../utils/constants");
const { convertVideo } = require("../../utils/codec-adjuster");

module.exports.downloadVDFacebook = async function ({ from: from, url: url }) {
  try {
    const filePath = path.join(
      videosFolderPathBruteCodecs,
      platformsNameDownload.facebook
    );

    const outputPath = path.join(
      videosFolderPathAjustedCodecs,
      platformsNameDownload.facebook
    );

    const getFacebookURL = await getXURL({ url: url });
    if (getFacebookURL == false)
      throw new Error("a url de download esta com problemas");

    await downloadVideo({
      url: getFacebookURL.sd,
      filePath: filePath,
    });

    await convertVideo({
      input: filePath,
      platform: platformsNameDownload.facebook,
    });

    await genericSendMessageOrchestrator({
      from: from,
      filePath: outputPath,
      type: "media",
      isDocument: false,
    });
  } catch (error) {
    console.error("Erro ao baixar o vídeo facebook:", error);

    await genericSendMessageOrchestrator({
      type: "text",
      situation: "failureDownload",
    });
  }
};

const getXURL = async ({ url: rawURL }) => {
  try {
    const XURL = await getFbVideoInfo(rawURL);
    const condition = XURL.url;

    if (condition) {
      return XURL;
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
