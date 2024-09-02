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
  imagesFolderPath,
} = require("../../utils/constants");

const instagramGetUrl = require("instagram-url-direct");

const { downloadVideoOrPhoto } = require("../../utils/downloadVideo");

module.exports.downloadInstagram = async function ({
  url: url,
  type: type,
  toSend = true,
}) {
  try {
    const filePath = path.join(
      videosFolderPathBruteCodecs,
      platformsNameDownload.instagram
    );

    const filePathPhoto = path.join(
      imagesFolderPath,
      platformsNameDownload.instagramPhoto
    );

    const URLDownload = await getInstagramURL({ url: url });

    if (URLDownload == false) {
      throw new Error("a url de download esta com problemas");
    }

    await downloadVideoOrPhoto({
      url: URLDownload,
      filePath: type == "photo" ? filePathPhoto : filePath,
    });

    if (toSend) {
      const finalFilePath = type === "photo" ? filePathPhoto : filePath;

      await genericSendMessageOrchestrator({
        filePath: finalFilePath,
        type: "media",
        isDocument: false,
      });
    }
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
    console.error(error.message);
    return false;
  }
};
