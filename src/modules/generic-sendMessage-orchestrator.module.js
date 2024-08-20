const { MessageMedia } = require("whatsapp-web.js");
const { client } = require("../settings/settings");
const {
  shippingAllowed,
  stringToGroup,
} = require("../settings/necessary-settings");

const { structuredMessages } = require("../utils/structured-messages");
const {
  successDownloadPhotoMessage,
  successDownloadMessage,
  failureDownloadMessage,
  technicalLimitationsMessage,
  attemptToDownloadMessage,
  YTVideoDurationExceeded,
} = structuredMessages;

module.exports.genericSendMessageOrchestrator = async function ({
  from,
  type,
  msg = false,
  filePath = false,
  isDocument = false,
  content = false,
  situation,
}) {
  if (shippingAllowed == false) return;

  switch (type) {
    case "text":
      switch (situation) {
        case "successDownload":
          await sendTextMessage({
            msg: successDownloadMessage,
          });

        case "failureDownload":
          await sendTextMessage({ msg: failureDownloadMessage });
          break;

        case "technicalLimitations":
          await sendTextMessage({ msg: technicalLimitationsMessage });
          break;

        case "attemptToDownload":
          await sendTextMessage({ msg: attemptToDownloadMessage });
          break;
        case "YTVideoDurationExceeded":
          await sendTextMessage({ msg: YTVideoDurationExceeded });
          break;
      }
      // await sendTextMessage({ msg: `[Bot]\n ${msg}` });
      break;
    case "media":
      const media = MessageMedia.fromFilePath(filePath);
      try {
        await client.sendMessage(stringToGroup, media, {
          sendMediaAsDocument: isDocument,
        });

        await client.sendMessage(
          stringToGroup,
          isDocument
            ? technicalLimitationsMessage
            : filePath.includes(".jpg")
            ? successDownloadPhotoMessage
            : successDownloadMessage
        );
      } catch (err) {
        console.error(err);
        await client.sendMessage(stringToGroup, failureDownloadMessage);
      }
      break;
    case "sticker":
      try {
        await client.sendMessage(stringToGroup, content, {
          sendMediaAsSticker: true,
        });
      } catch (err) {
        console.error(err);
        await client.sendMessage(stringToGroup, failureDownloadMessage);
      }
  }
};

const sendTextMessage = async ({ msg: msg }) => {
  await client.sendMessage(stringToGroup, msg);
};
