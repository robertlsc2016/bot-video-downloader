const { MessageMedia } = require("whatsapp-web.js");
const { client } = require("../settings/settings");
const { stringToGroup } = require("../settings/necessary-settings");

const { structuredMessages } = require("../utils/structured-messages");
const { checkActions } = require("../utils/check-actions");
const {
  successDownloadPhotoMessage,
  successDownloadMessage,
  failureDownloadMessage,
  technicalLimitationsMessage,
  attemptToDownloadMessage,
  YTVideoDurationExceeded,
} = structuredMessages;

module.exports.genericSendMessageOrchestrator = async function ({
  type,
  msg = "",
  filePath = false,
  isDocument = false,
  content = false,
  textMedia = true,
  situation,
  mentions = [],
}) {
  if (!(await checkActions({ typeAction: "bot_active" }))) {
    return await client.sendMessage(stringToGroup, msg);
  }

  switch (type) {
    case "text":
      switch (situation) {
        case "mentions":
          await sendTextMessage({
            msg: msg,
            mentions: mentions,
          });
          break;

        case "successDownload":
          await sendTextMessage({
            msg: successDownloadMessage,
          });
          break;

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

        default:
          await sendTextMessage({ msg: msg });
          break;
      }
      break;
    case "media":
      const media = MessageMedia.fromFilePath(filePath);
      try {
        await client.sendMessage(stringToGroup, media, {
          sendMediaAsDocument: isDocument,
          caption: msg,
        });

        if (textMedia) {
          await client.sendMessage(
            stringToGroup,
            isDocument
              ? technicalLimitationsMessage
              : filePath.includes(".jpg")
              ? successDownloadPhotoMessage
              : successDownloadMessage
          );
        }
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

const sendTextMessage = async ({ msg: msg, mentions: mentions }) => {
  return await client.sendMessage(stringToGroup, `[Bot]\n${msg}`, {
    mentions: mentions,
  });
};
