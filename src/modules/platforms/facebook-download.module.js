const fs = require("fs");
const path = require("path");
const getFbVideoInfo = require("fb-downloader-scrapper");
const axios = require("axios");

const { runClient, client } = require("../../settings/settings");
const { sendVideo } = require("../send-video.module");
const { downloadVideo } = require("../../utils/downloadVideo");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const {
  videosFolderPath,
  platformsNameDownload,
} = require("../../utils/constants");

module.exports.downloadVDFacebook = async function (from, url) {
  try {
    console.log("entrou no facebook");
    const filePath = path.join(
      videosFolderPath,
      platformsNameDownload.facebook
    );

    const getFacebookURL = await getFbVideoInfo(url).catch((err) => {
      throw new Error(err);
    });

    await downloadVideo(getFacebookURL.sd, filePath);
    await genericSendMessageOrchestrator({
      from: from,
      filePath: filePath,
      type: "media",
      isDocument: true,
    });
  } catch (error) {
    console.error("Erro ao baixar o vídeo:", error);
  }
};
