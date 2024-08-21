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

const instagramGetUrl = require("instagram-url-direct");

const { downloadVideo } = require("../../utils/downloadVideo");
const { convertVideo } = require("../../utils/codec-adjuster");
const { ISDOCUMENT } = require("../../settings/feature-enabler");

module.exports.downloadInstagram = async function ({ url: url, type: type }) {

  try {
    const filePath = path.join(
      videosFolderPathBruteCodecs,
      platformsNameDownload.instagram
    );

    const filePathPhoto = path.join(
      videosFolderPathBruteCodecs,
      platformsNameDownload.instagramPhoto
    );

    const URLDownload = await getInstagramURL({ url: url });

    if (URLDownload == false) {
      throw new Error("a url de download esta com problemas");
    }

    await downloadVideo({
      url: URLDownload,
      filePath: type == "photo" ? filePathPhoto : filePath,
    });

    await genericSendMessageOrchestrator({
      filePath: type == "photo" ? filePathPhoto : filePath,
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

const getInstagramURL = async ({ url: rawURL }) => {
  try {
    const { results_number, url_list } = await instagramGetUrl(rawURL);

    if (results_number > 0) {
      return url_list[0];
    }

    throw new Error(
      "Problema no retorno do link da API getFbVideoInfo. Talvez o link de entrada esteja incorreto ou inválido."
    );
  } catch (error) {
    console.error(error.message); // Log do erro para depuração
    return false;
  }
};
