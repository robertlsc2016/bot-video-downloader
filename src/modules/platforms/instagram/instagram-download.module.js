const {
  genericSendMessageOrchestrator,
} = require("../../generic-sendMessage-orchestrator.module");
const { downloadVideoOrPhoto } = require("../../../utils/downloadVideo");
const logger = require("../../../logger");
const { getInstagramURL } = require("./instagram-getURL.module");
const { pathTo } = require("../../../utils/path-orchestrator");
const {
  convertVideoToAudio,
} = require("../../../utils/convert-video-to-audio");
const { monitorUsageActions } = require("../../../utils/monitor-usage-actions");

const filePath = pathTo.medias.videos.bruteCodecsFolder.instagram;
const filePathPhoto = pathTo.medias.images.instagram;
const outputAudioFilePath = pathTo.medias.audios.audio;

module.exports.downloadInstagram = async function ({
  url: url,
  toSend = true,
  mode,
  msg,
}) {
  let index_filter = Number(msg.split(" ")[1]) - 1 || 0;

  try {
    let type = null;
    const URLDownload = await getInstagramURL({
      url: url,
      index: index_filter,
    });

    if (URLDownload == false) {
      throw new Error("a url de download esta com problemas");
    }

    URLDownload.includes("jpg") ? (type = "photo") : (type = "video");
    let path = type == "photo" ? filePathPhoto : filePath;

    type == "photo"
      ? monitorUsageActions({
          action: "instagram_download_photo",
        })
      : monitorUsageActions({
          action: "instagram_download_video",
        });

    await downloadVideoOrPhoto({
      url: URLDownload,
      filePath: path,
    });

    if (mode == "extractAudio") {
      await convertVideoToAudio({ path: path });
      path = outputAudioFilePath;
    }

    if (toSend) {
      return await sendMedia({
        filepath: path,
      });
    }

    return path;
  } catch (error) {
    return await genericSendMessageOrchestrator({
      type: "text",
      msg: error.message || "failureDownload",
    }).then(() => {
      logger.error(error);
    });
  }
};

const sendMedia = async ({ filepath }) => {
  return await genericSendMessageOrchestrator({
    filePath: filepath,
    type: "media",
    isDocument: false,
  });
};
