const { downloadVideoOrPhoto } = require("../../../utils/downloadVideo");
const {
  genericSendMessageOrchestrator,
} = require("../../generic-sendMessage-orchestrator.module");

const { url } = require("inspector");
const { getFacebookURL } = require("./facebook-getURL.module");
const logger = require("../../../logger");
const { pathTo } = require("../../../utils/path-orchestrator");
const {
  convertVideoToAudio,
} = require("../../../utils/convert-video-to-audio");
const { monitorUsageActions } = require("../../../utils/monitor-usage-actions");

const filePath = pathTo.medias.videos.bruteCodecsFolder.facebook;
const filePathPhoto = pathTo.medias.images.facebook;
const outputAudioFilePath = pathTo.medias.audios.audio;

module.exports.downloadVDFacebook = async function ({
  url: url,
  type: type,
  mode,
}) {
  try {
    type == "photo"
      ? monitorUsageActions({
          action: "facebook_download_photo",
        })
      : monitorUsageActions({
          action: "facebook_download_video",
        });

    const path = type == "photo" ? filePathPhoto : filePath;
    const facebookURL = await getFacebookURL({ url: url, type: type });

    if (getFacebookURL == false)
      throw new Error("a url de download esta com problemas");

    await downloadVideoOrPhoto({
      url: type == "photo" ? facebookURL : facebookURL.sd,
      filePath: path,
    });

    if (mode == "extractAudio") {
      await convertVideoToAudio({ path: path });
      return await genericSendMessageOrchestrator({
        filePath: outputAudioFilePath,
        type: "media",
        isDocument: false,
      });
    }

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
