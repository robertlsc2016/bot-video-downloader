const path = require("path");
const getFbVideoInfo = require("fb-downloader-scrapper");
const { downloadVideo } = require("../../utils/downloadVideo");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const {
  videosFolderPath,
  platformsNameDownload,
} = require("../../utils/constants");

module.exports.downloadVDFacebook = async function ({ from: from, url: url }) {
  try {
    const filePath = path.join(
      videosFolderPath,
      platformsNameDownload.facebook
    );

    const getFacebookURL = await getXURL({ url: url });
    if (getFacebookURL == false) throw new Error("a url de download esta com problemas");
    
    await downloadVideo({
      url: getFacebookURL.sd,
      filePath: filePath,
    });

    await genericSendMessageOrchestrator({
      from: from,
      filePath: filePath,
      type: "media",
      isDocument: true,
    });
  } catch (error) {
    console.error("Erro ao baixar o vídeo facebook:", error);
    await genericSendMessageOrchestrator({
      from: from,
      type: "text",
      msg: failureDownloadMessage,
    });
  }
};

const getXURL = async ({ url: rawURL }) => {
  try {
    const XURL = await getFbVideoInfo(rawURL);
    const condition = XURL.url;

    if (condition) {
      console.log(XURL.url);
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
