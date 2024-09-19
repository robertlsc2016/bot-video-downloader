const { downloadVideoOrPhoto } = require("../../utils/downloadVideo");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");

const TikChan = require("tikchan");
const { pathTo } = require("../../utils/path-orchestrator");

module.exports.downloadVDTiktok = async function ({ url }) {
  try {
    const filePathVideo = pathTo.medias.videos.bruteCodecsFolder.tiktok;

    const URLDownload = await getXURL({ url: url });

    if (URLDownload == false)
      throw new Error("a url de download esta com problemas");

    await downloadVideoOrPhoto({ url: URLDownload, filePath: filePathVideo });

    await genericSendMessageOrchestrator({
      filePath: filePathVideo,
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
