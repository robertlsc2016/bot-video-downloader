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

module.exports.turnInSticker = async function ({ message, url, platform }) {
  let image;

  if (url) {
    const urlPhoto = await filterPlatform({ url, platform });
    image = await MessageMedia.fromUrl(urlPhoto);
  } else {
    const mediafile = await message.downloadMedia();
    image = new MessageMedia("image/jpeg", mediafile.data, "image.jpg");
  }

  await genericSendMessageOrchestrator({
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
      return await getPintrestURL({ url: url });
  }
};
