const { stringToGroup } = require("../../settings/necessary-settings");
const path = require("path");

const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const { MessageMedia } = require("whatsapp-web.js");

const {
  getInstagramURL,
} = require("../platforms/instagram/instagram-getURL.module");
const {
  getPintrestURL,
} = require("../platforms/pintrest/pintrest-getURL.module");
const {
  getFacebookURL,
} = require("../platforms/facebook/facebook-getURL.module");
const { client } = require("../../settings/settings");
const { monitorUsageActions } = require("../../utils/monitor-usage-actions");

module.exports.turnInSticker = async function ({
  message,
  url,
  platform,
  situation,
}) {
  monitorUsageActions({
    action: "turn_in_sticker",
  });

  let image;
  switch (situation) {
    case "image":
      const mediafile = await message.downloadMedia();
      image = new MessageMedia("image/jpeg", mediafile.data, "image.jpg");
      break;

    case "url":
      const urlPhoto = await filterPlatform({ url, platform });
      image = await MessageMedia.fromUrl(urlPhoto);
      break;

    case "answered":
      if (!message._data.quotedMsg?.id?._serialized) {
        return await genericSendMessageOrchestrator({
          type: "text",
          msg: "Não tenho as informações desta mensagem. Envie novamente na conversa e tente novamente",
        });
      }

      const getImage = await client.getMessageById(
        message._data.quotedMsg?.id._serialized
      );

      const mediafileAnswed = await getImage.downloadMedia();
      image = new MessageMedia("image/jpeg", mediafileAnswed.data, "image.jpg");
      break;
  }

  return await genericSendMessageOrchestrator({
    from: stringToGroup,
    content: image,
    type: "sticker",
  });
};

const filterPlatform = async ({ url, platform }) => {
  switch (platform) {
    case "instagram":
      return await getInstagramURL({ url: url });
    case "facebook":
      return await getFacebookURL({ url: url, type: "photo" });
    case "pintrest":
      return await getPintrestURL({ rawURL: url });
  }
};
