const { MessageMedia } = require("whatsapp-web.js");
const { client } = require("../settings/settings");
const { shippingAllowed } = require("../settings/necessary-settings");
const {
  technicalLimitationsMessage,
  successDownloadMessage,
  failureDownloadMessage,
} = require("../utils/constants");

module.exports.genericSendMessageOrchestrator = async function ({
  from,
  type,
  msg = false,
  filePath = false,
  isDocument = false,
  content = false,
}) {
  if (shippingAllowed == false) return;

  switch (type) {
    case "text":
      await client.sendMessage(from, msg);
      break;
    case "media":
      const media = MessageMedia.fromFilePath(filePath);
      try {
        await client.sendMessage(from, media, {
          caption: isDocument
            ? technicalLimitationsMessage
            : successDownloadMessage,
          sendMediaAsDocument: isDocument,
        });
      } catch (err) {
        console.error(err);
        await client.sendMessage(from, failureDownloadMessage);
      }
      break;
    case "sticker":
      try {
        await client.sendMessage(from, content, {
          sendMediaAsSticker: true,
        });
      } catch (err) {
        console.error(err);
        await client.sendMessage(from, failureDownloadMessage);
      }
  }
};
