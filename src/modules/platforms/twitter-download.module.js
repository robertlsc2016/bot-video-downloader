const path = require("path");
const { downloadVideo } = require("../../utils/downloadVideo");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const { failureDownloadMessage } = require("../../utils/constants");
const getTwitterMedia = require("get-twitter-media");

module.exports.downloadVDTwitter = async function (url, from) {
  try {
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "videos",
      "x-video.mp4"
    );

    const getURLDownload = await getTwitterMedia(url);
    if (!getURLDownload.media[0]) throw new Error();

    const URLDownload = getURLDownload.media[0].url;

    await downloadVideo({ url: URLDownload, filePath: filePath });
    await genericSendMessageOrchestrator({
      from: from,
      filePath: filePath,
      type: "media",
    });
  } catch (error) {
    console.error("Erro ao baixar o vídeo x:", error);
    await genericSendMessageOrchestrator({
      from: from,
      type: "text",
      msg: failureDownloadMessage,
    });
  }
};
