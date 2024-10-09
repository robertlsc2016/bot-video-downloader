const { downloadVideoOrPhoto } = require("../../utils/downloadVideo");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

const getTwitterMedia = require("get-twitter-media");
const { pathTo } = require("../../utils/path-orchestrator");

module.exports.downloadVDTwitter = async function ({ url: url }) {
  try {
    const filePathVideo = pathTo.medias.videos.bruteCodecsFolder.x;
    const filePathImage = pathTo.medias.images.x;

    const URLDownload = await getXURL({ url: url });
    const path = URLDownload?.includes(".mp4") ? filePathVideo : filePathImage;

    if (URLDownload == false)
      throw new Error("a url de download esta com problemas");

    await downloadVideoOrPhoto({ url: URLDownload, filePath: path });
    await genericSendMessageOrchestrator({
      filePath: path,
      type: "media",
      isDocument: false,
    });
  } catch (error) {
    await genericSendMessageOrchestrator({
      type: "text",
      situation: "failureDownload",
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
