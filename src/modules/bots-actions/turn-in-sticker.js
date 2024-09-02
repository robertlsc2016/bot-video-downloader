const { stringToGroup } = require("../../settings/necessary-settings");
const path = require("path");

const {
  videosFolderPathBruteCodecs,
  platformsNameDownload,
  imagesFolderPath,
} = require("../../utils/constants");
const { downloadVideoOrPhoto } = require("../../utils/downloadVideo");
const {
  genericSendMessageOrchestrator,
} = require("../generic-sendMessage-orchestrator.module");
const { MessageMedia } = require("whatsapp-web.js");
const { downloadInstagram } = require("../platforms/instagram-download.module");

module.exports.turnInSticker = async function ({ message, fromURL }) {
  const filePathPhoto = path.join(
    imagesFolderPath,
    platformsNameDownload.instagramPhoto
  );

  let image;

  if (fromURL) {
    await downloadInstagram({
      type: "photo",
      toSend: false,
      url: fromURL,
    });

    image = MessageMedia.fromFilePath(filePathPhoto);

    // return await genericSendMessageOrchestrator({
    //   from: stringToGroup,
    //   content: image,
    //   type: "sticker",
    // });
    // console.log(image);
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
