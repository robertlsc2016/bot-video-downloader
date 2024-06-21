const path = require("path");
const { downloadVideo } = require("../../utils/downloadVideo");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const {
  failureDownloadMessage,
  videosFolderPath,
  platformsNameDownload,
} = require("../../utils/constants");
const getTwitterMedia = require("get-twitter-media");

module.exports.downloadVDTwitter = async function ({ from: from, url: url }) {
  try {
    const filePath = path.join(videosFolderPath, platformsNameDownload.x);
    const URLDownload = await getXURL({ url: url });

    if (URLDownload == false)
      throw new Error("a url de download esta com problemas");

    await downloadVideo({ url: URLDownload, filePath: filePath });
    await genericSendMessageOrchestrator({
      from: from,
      filePath: filePath,
      type: "media",
    });
  } catch (error) {
    await genericSendMessageOrchestrator({
      from: from,
      type: "text",
      msg: failureDownloadMessage,
    });
  }
};

const getXURL = async ({ url: rawURL }) => {
  try {
    const XURL = await getTwitterMedia(rawURL);
    const condition = XURL.media && XURL.media[0].url;

    if (condition) {
      return XURL.media[0].url;
    }

    if (XURL.found == false) {
      throw new Error(
        "problema no retorno do link da api getTwitterMedia. Talvez o link de entrada esteja incorreto ou inválido"
      );
    }

  } catch (error) {
    return false;
  }
};
