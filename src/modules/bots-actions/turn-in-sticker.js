const { stringToGroup } = require("../../settings/necessary-settings");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const { MessageMedia } = require("whatsapp-web.js");

module.exports.turnInSticker = async function ({ message }) {
  const mediafile = await message.downloadMedia();
  const image = new MessageMedia("image/jpeg", mediafile.data, "image.jpg");

  await genericSendMessageOrchestrator({
    from: stringToGroup,
    content: image,
    type: "sticker",
  });

};
