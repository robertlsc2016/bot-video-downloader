const { MessageMedia } = require("whatsapp-web.js");
const { client } = require("../settings/settings");
const { stringToGroup } = require("../settings/necessary-settings");

const { structuredMessages } = require("../utils/structured-messages");
const { checkActions } = require("../utils/check-actions");
const { getStartValue } = require("../utils/stopwatch");
const fs = require("fs");
const { pathTo } = require("../utils/path-orchestrator");

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
  const start = await getStartValue();

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
        const [seconds, nanoseconds] = process.hrtime(start); // Calcula a diferença do tempo
        const timeText = `\n_Levei ${seconds}s e ${(nanoseconds / 1e6).toFixed(
          0
        )}ms para baixar essa mídia_`;

        if (textMedia) {
          await client.sendMessage(
            stringToGroup,
            isDocument
              ? technicalLimitationsMessage
              : filePath.includes(".jpg")
              ? `${successDownloadPhotoMessage}${timeText}`
              : `${successDownloadMessage}${timeText}`
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
  const rawData = fs.readFileSync(pathTo.pathToSelectGroupJson, "utf8");
  let { STRING_TO_GROUP_WWEBJS } = JSON.parse(rawData);

  return await client.sendMessage(STRING_TO_GROUP_WWEBJS, `[Bot]\n${msg}`, {
    mentions: mentions,
  });
};
