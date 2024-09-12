const path = require("path");
const getFbVideoInfo = require("fb-downloader-scrapper");
const { downloadVideoOrPhoto } = require("../../../utils/downloadVideo");
const {
  genericSendMessageOrchestrator,
} = require("../../generic-sendMessage-orchestrator.module");
const {
  platformsNameDownload,

  videosFolderPathAjustedCodecs,
  videosFolderPathBruteCodecs,
  imagesFolderPath,
} = require("../../../utils/constants");
const { url } = require("inspector");
const { getFacebookURL } = require("./facebook-getURL.module");
const logger = require("../../../logger");

const filePath = path.join(
  videosFolderPathBruteCodecs,
  platformsNameDownload.facebook
);

const filePathPhoto = path.join(
  imagesFolderPath,
  platformsNameDownload.facebookPhoto
);
module.exports.downloadVDFacebook = async function ({ url: url, type: type }) {
  try {
    const path = type == "photo" ? filePathPhoto : filePath;

    const facebookURL = await getFacebookURL({ url: url, type: type });

    if (getFacebookURL == false)
      throw new Error("a url de download esta com problemas");

    await downloadVideoOrPhoto({
      url: type == "photo" ? facebookURL : facebookURL.sd,
      filePath: path,
    });

    // await convertVideo({
    //   input: filePath,
    //   platform: platformsNameDownload.facebook,
    // });

    await genericSendMessageOrchestrator({
      filePath: path,
      type: "media",
      isDocument: false,
    });
  } catch (error) {
    logger.error(error);

    await genericSendMessageOrchestrator({
      type: "text",
      situation: "failureDownload",
    });
  }
};
